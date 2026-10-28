import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const DIST_DIR = path.resolve('dist');
const SCREENSHOT_DIR = path.resolve('tests/screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function startStaticServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = (req.url || '/').split('?')[0];
      let filePath = path.join(
        DIST_DIR,
        cleanUrl === '/' ? 'index.html' : decodeURIComponent(cleanUrl)
      );
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME_TYPES[ext || '.html'] || 'application/octet-stream',
      });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runQA() {
  const server = await startStaticServer(4173);
  const chromePath =
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.resolve('tests/.chrome-profile');
  fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(
    chromePath,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--remote-debugging-port=9229',
      `--user-data-dir=${userDataDir}`,
      'http://127.0.0.1:4173/',
    ],
    { stdio: 'ignore' }
  );

  try {
    let wsUrl = null;
    for (let i = 0; i < 30; i++) {
      await sleep(300);
      try {
        const res = await fetch('http://127.0.0.1:9229/json');
        const pages = await res.json();
        const page = pages.find((p) => p.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {
        // Reintentar
      }
    }

    if (!wsUrl) {
      throw new Error('No se pudo conectar al navegador headless via CDP.');
    }

    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 0;
    const pending = new Map();
    const consoleErrors = [];

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.exceptionThrown') {
        consoleErrors.push(
          data.params?.exceptionDetails?.text || 'Runtime exception'
        );
      }
      if (data.method === 'Runtime.consoleAPICalled') {
        if (data.params?.type === 'error') {
          consoleErrors.push(
            data.params.args.map((a) => a.value || a.description).join(' ')
          );
        }
      }
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      }
    };

    const sendCDP = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const id = ++msgId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });

    const evaluate = async (expression) => {
      const res = await sendCDP('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (res.exceptionDetails) {
        throw new Error(
          `JS Eval Error: ${res.exceptionDetails.text} (${expression})`
        );
      }
      return res.result?.value;
    };

    const captureScreenshot = async (filename) => {
      const { data } = await sendCDP('Page.captureScreenshot', {
        format: 'png',
      });
      fs.writeFileSync(
        path.join(SCREENSHOT_DIR, filename),
        Buffer.from(data, 'base64')
      );
    };

    await sendCDP('Page.enable');
    await sendCDP('Runtime.enable');
    await sendCDP('Page.navigate', { url: 'http://127.0.0.1:4173/' });
    await sleep(800);

    const results = [];
    const recordCheck = (num, title, passed, detail) => {
      results.push({ num, title, passed, detail });
      console.log(
        `${passed ? '✅' : '❌'} [Prueba ${num}] ${title}: ${detail}`
      );
    };

    // 1. Verificar inicio, Avatar Dari en Bienvenida y Responsive en 320, 360, 390, 430 y 1280px
    const viewports = [
      { width: 320, height: 680, name: '320px' },
      { width: 360, height: 740, name: '360px' },
      { width: 390, height: 844, name: '390px' },
      { width: 430, height: 932, name: '430px' },
      { width: 1280, height: 800, name: '1280px' },
    ];

    let overflowDetected = false;
    for (const vp of viewports) {
      await sendCDP('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 640,
      });
      await sleep(180);
      const checkOverflow = await evaluate(`({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      })`);
      if (checkOverflow.scrollWidth > vp.width + 1) {
        overflowDetected = true;
      }
      if (vp.width === 390) {
        await captureScreenshot('01-welcome-mobile-390px.png');
      }
      if (vp.width === 1280) {
        await captureScreenshot('01-welcome-desktop-1280px.png');
      }
    }

    // Volver a móvil 390x844
    await sendCDP('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(200);

    const welcomeData = await evaluate(`({
      title: document.querySelector('#welcome-main-title')?.textContent?.trim(),
      hasDari: Boolean(document.querySelector('.dari-companion-card')),
      dariPose: document.querySelector('.dari-avatar-wrapper')?.className || '',
      dariText: document.querySelector('.dari-bubble-text')?.textContent?.trim() || '',
      hasStartBtn: Boolean(document.querySelector('#btn-start-game')),
      startBtnHeight: document.querySelector('#btn-start-game')?.getBoundingClientRect().height || 0,
      inputsCount: document.querySelectorAll('input, form, textarea').length,
      logosLoaded: Array.from(document.querySelectorAll('.institutional-logos img')).every(img => img.complete && img.naturalWidth > 0)
    })`);

    recordCheck(
      1,
      'Inicio correcto, logotipos oficiales y Avatar Dari en Bienvenida',
      welcomeData.title === 'DAR Y RECIBIR' &&
        welcomeData.logosLoaded &&
        welcomeData.hasDari &&
        welcomeData.dariPose.includes('pose-welcome') &&
        welcomeData.dariText.includes('Soy Dari'),
      `Dari presente=${welcomeData.hasDari}, Pose="welcome", Saludo="${welcomeData.dariText.slice(
        0,
        48
      )}..."`
    );

    // Probar botón de explicación inicial de Dari en la bienvenida
    await evaluate(`document.querySelector('.btn-dari-inline-tip')?.click()`);
    await sleep(150);
    const welcomeExplainData = await evaluate(`({
      pose: document.querySelector('.dari-avatar-wrapper')?.className || '',
      text: document.querySelector('.dari-bubble-text')?.textContent?.trim() || ''
    })`);

    recordCheck(
      2,
      'Cambio de diálogo y estado visual de Dari a Explicación inicial',
      welcomeExplainData.pose.includes('pose-explaining') &&
        welcomeExplainData.text.includes('Es muy fácil jugar'),
      `Pose="explaining", Texto="${welcomeExplainData.text.slice(0, 48)}..."`
    );

    // Probar controles de reproducir, silenciar y reactivar voz de Dari
    await evaluate(`document.querySelector('.btn-dari-listen')?.click()`);
    await sleep(120);
    await evaluate(`document.querySelector('.btn-dari-mute')?.click()`);
    await sleep(120);
    const mutedState = await evaluate(
      `document.querySelector('.btn-dari-mute')?.getAttribute('aria-pressed')`
    );
    await evaluate(`document.querySelector('.btn-dari-mute')?.click()`);
    await sleep(120);
    const unmutedState = await evaluate(
      `document.querySelector('.btn-dari-mute')?.getAttribute('aria-pressed')`
    );

    recordCheck(
      3,
      'Controles de voz de Dari (Escuchar, Repetir, Silenciar/Activar)',
      mutedState === 'true' && unmutedState === 'false',
      `Estado silenciado=${mutedState} -> Reactivado=${unmutedState}`
    );

    recordCheck(
      4,
      'Diseño responsive en 320, 360, 390, 430 y 1280px sin desbordamientos',
      !overflowDetected && welcomeData.startBtnHeight >= 48,
      `Desbordamiento=${overflowDetected}, Altura CTA=${Math.round(
        welcomeData.startBtnHeight
      )}px`
    );

    // Iniciar Reto 1
    await evaluate(`document.querySelector('#btn-start-game')?.click()`);
    await sleep(250);
    await captureScreenshot('03-challenge1-start.png');

    const c1InitialDari = await evaluate(`({
      stage: document.querySelector('.app-shell')?.getAttribute('data-stage'),
      hasDari: Boolean(document.querySelector('.dari-companion-card')),
      text: document.querySelector('.dari-bubble-text')?.textContent || ''
    })`);

    recordCheck(
      5,
      'Dari acompaña la entrada al Reto 1 explicando DAR y RECIBIR',
      c1InitialDari.stage === 'challenge1' &&
        c1InitialDari.hasDari &&
        c1InitialDari.text.includes('Primer reto'),
      `Etapa="${c1InitialDari.stage}", Diálogo="${c1InitialDari.text.slice(
        0,
        52
      )}..."`
    );

    // Partida 1 (con errores intencionales para comprobar estado de ánimo comprensivo de Dari y puntaje < 60)
    let encouragingPoseSeen = false;
    let happyPoseSeen = false;

    for (let i = 0; i < 6; i++) {
      const cardText = await evaluate(
        `document.querySelector('.sort-card-main-text')?.textContent || ''`
      );
      const isDar =
        cardText.includes('documentación real') ||
        cardText.includes('amabilidad y respeto') ||
        cardText.includes('normas y reglamentos');

      // Primero elegir la categoría incorrecta dos veces para verificar el estado "encouraging" de Dari
      const wrongSelector = isDar ? '.zone-recibir' : '.zone-dar';
      const rightSelector = isDar ? '.zone-dar' : '.zone-recibir';

      await evaluate(`document.querySelector('${wrongSelector}')?.click()`);
      await sleep(100);
      const poseOnWrong = await evaluate(
        `document.querySelector('.dari-avatar-wrapper')?.className || ''`
      );
      if (poseOnWrong.includes('pose-encouraging')) {
        encouragingPoseSeen = true;
      }
      await evaluate(`document.querySelector('${wrongSelector}')?.click()`);
      await sleep(80);

      // Ahora elegir la correcta
      await evaluate(`document.querySelector('${rightSelector}')?.click()`);
      await sleep(100);
      const poseOnRight = await evaluate(
        `document.querySelector('.dari-avatar-wrapper')?.className || ''`
      );
      if (
        poseOnRight.includes('pose-happy') ||
        poseOnRight.includes('pose-celebrating')
      ) {
        happyPoseSeen = true;
      }

      if (i === 0) {
        await captureScreenshot('04-challenge1-feedback.png');
      }

      await evaluate(`document.querySelector('#btn-c1-next')?.click()`);
      await sleep(120);
    }

    recordCheck(
      6,
      'Reacciones emocionales de Dari en Reto 1 (Ánimo ante error y Alegría en acierto)',
      encouragingPoseSeen && happyPoseSeen,
      `Pose comprensiva vista=${encouragingPoseSeen}, Pose alegre vista=${happyPoseSeen}`
    );

    // Reto 2 (activar modo silenciado "Sin sonido" para verificar que el juego se completa sin audio)
    await captureScreenshot('05-challenge2-start.png');
    await evaluate(`document.querySelector('.btn-dari-mute')?.click()`);
    await sleep(100);

    for (let s = 0; s < 5; s++) {
      for (let optIdx = 0; optIdx < 3; optIdx++) {
        const isSolved = await evaluate(
          `Boolean(document.querySelector('#btn-c2-next'))`
        );
        if (isSolved) break;
        await evaluate(
          `document.querySelectorAll('.scenario-option-btn')[${optIdx}]?.click()`
        );
        await sleep(90);
      }
      await evaluate(`document.querySelector('#btn-c2-next')?.click()`);
      await sleep(120);
    }

    // Reto 3
    await captureScreenshot('06-challenge3-start.png');
    for (let g = 0; g < 2; g++) {
      for (let step = 0; step < 3; step++) {
        for (let d = 0; d < 3; d++) {
          const prevMatched = await evaluate(
            `document.querySelectorAll('.concept-card-matched').length`
          );
          await evaluate(
            `document.querySelectorAll('.match-desc-card')[${d}]?.click()`
          );
          await sleep(70);
          const nowMatched = await evaluate(
            `document.querySelectorAll('.concept-card-matched').length`
          );
          if (nowMatched > prevMatched) break;
          await evaluate(
            `document.querySelectorAll('.match-desc-card')[${d}]?.click()`
          );
          await sleep(60);
        }
      }
      await evaluate(`document.querySelector('#btn-c3-next')?.click()`);
      await sleep(140);
    }

    // Verificar Resultado < 60 y mensaje de ánimo de Dari
    const lowScoreResult = await evaluate(`({
      stage: document.querySelector('.app-shell')?.getAttribute('data-stage'),
      score: Number(document.querySelector('.score-big-number')?.textContent || '0'),
      dariText: document.querySelector('.dari-bubble-text')?.textContent || '',
      hasRetryBtn: Boolean(document.querySelector('#btn-retry-game'))
    })`);

    await captureScreenshot('07-results-below-60.png');

    recordCheck(
      7,
      'Resultado < 60 completado sin sonido y con diálogo de ánimo de Dari',
      lowScoreResult.stage === 'results' &&
        lowScoreResult.score < 60 &&
        lowScoreResult.dariText.includes('Buen esfuerzo') &&
        lowScoreResult.hasRetryBtn,
      `Puntaje=${lowScoreResult.score}/100, Diálogo Dari="${lowScoreResult.dariText.slice(
        0,
        48
      )}..."`
    );

    // Reiniciar con "VOLVER A INTENTAR" y completar partida con calificación >= 60 (100/100)
    await evaluate(`document.querySelector('#btn-retry-game')?.click()`);
    await sleep(220);

    // Reactivar voz
    await evaluate(`document.querySelector('.btn-dari-mute')?.click()`);
    await sleep(80);

    // Reto 1 perfecto
    for (let i = 0; i < 6; i++) {
      const cardText = await evaluate(
        `document.querySelector('.sort-card-main-text')?.textContent || ''`
      );
      const isDar =
        cardText.includes('documentación real') ||
        cardText.includes('amabilidad y respeto') ||
        cardText.includes('normas y reglamentos');

      await evaluate(
        `document.querySelector('${
          isDar ? '.zone-dar' : '.zone-recibir'
        }')?.click()`
      );
      await sleep(90);
      await evaluate(`document.querySelector('#btn-c1-next')?.click()`);
      await sleep(110);
    }

    // Reto 2 perfecto
    const correctSnippetsC2 = [
      'Recibir información clara y confidencial',
      'Presentar documentación real y asistir puntualmente',
      'Expresar sus opiniones e inconformidades',
      'Dar su consentimiento previo e informado',
      'Recibir respeto, trato humanizado',
    ];

    for (let s = 0; s < 5; s++) {
      await evaluate(`(() => {
        const btns = Array.from(document.querySelectorAll('.scenario-option-btn'));
        const snippets = ${JSON.stringify(correctSnippetsC2)};
        const winner = btns.find(b => snippets.some(sn => b.textContent.includes(sn)));
        if (winner) winner.click();
      })()`);
      await sleep(90);
      await evaluate(`document.querySelector('#btn-c2-next')?.click()`);
      await sleep(110);
    }

    // Reto 3 perfecto
    const pairKeywords = {
      'Consentimiento y 2.ª opinión': 'Decidir con información previa',
      'Información clara y confidencial': 'Comprender las explicaciones',
      'Beneficio de acompañamiento': 'Contar con un acompañante',
      'Documentación y puntualidad': 'Cumplir el deber de presentar documentación',
      'Amabilidad y respeto': 'Relacionarse con trato cordial',
      'Reconocimiento de las normas': 'Conocer y cumplir los reglamentos',
      'Atención integral y oportuna': 'Recibir servicios de salud de calidad',
      'Expresar opiniones': 'Manifestar peticiones, quejas',
      'Identificación por mi nombre': 'Saber el nombre de la persona',
      'Respeto y trato humanizado': 'Ser atendido con dignidad frente a tu condición',
    };

    for (let g = 0; g < 2; g++) {
      for (let step = 0; step < 3; step++) {
        await evaluate(`(() => {
          const map = ${JSON.stringify(pairKeywords)};
          const activeConcept = document.querySelector('.concept-card-selected .concept-card-title')?.textContent?.trim();
          const targetPhrase = map[activeConcept];
          const descCards = Array.from(document.querySelectorAll('.match-desc-card'));
          const matchBtn = descCards.find(d => d.textContent.includes(targetPhrase));
          if (matchBtn) matchBtn.click();
        })()`);
        await sleep(90);
      }
      await evaluate(`document.querySelector('#btn-c3-next')?.click()`);
      await sleep(130);
    }

    const highScoreResult = await evaluate(`({
      stage: document.querySelector('.app-shell')?.getAttribute('data-stage'),
      score: Number(document.querySelector('.score-big-number')?.textContent || '0'),
      dariText: document.querySelector('.dari-bubble-text')?.textContent || '',
      dariPose: document.querySelector('.dari-avatar-wrapper')?.className || '',
      summaryCardsCount: document.querySelectorAll('.learned-summary-section .principle-summary-card').length
    })`);

    await captureScreenshot('08-results-passed-100.png');

    recordCheck(
      8,
      'Resultado >= 60 muestra celebración de Dari, puntaje 100/100 y los 10 principios',
      highScoreResult.stage === 'results' &&
        highScoreResult.score === 100 &&
        highScoreResult.dariPose.includes('pose-celebrating') &&
        highScoreResult.dariText.includes('Lo lograste') &&
        highScoreResult.summaryCardsCount === 10,
      `Puntaje=${highScoreResult.score}/100, Pose="celebrating", Diálogo="${highScoreResult.dariText.slice(
        0,
        48
      )}..."`
    );

    recordCheck(
      9,
      'Cero errores en consola durante toda la experiencia con Dari',
      consoleErrors.length === 0,
      `Errores en consola=${consoleErrors.length}`
    );

    ws.close();

    const failed = results.filter((r) => !r.passed);
    if (failed.length > 0) {
      console.error('Algunas pruebas fallaron:', failed);
      process.exitCode = 1;
    } else {
      console.log(
        '\n🎉 TODAS LAS PRUEBAS AUTOMATIZADAS DE "DARI" Y DEL JUEGO PASARON CON ÉXITO.'
      );
    }
  } finally {
    chromeProc.kill();
    server.close();
  }
}

runQA().catch((err) => {
  console.error('Error ejecutando QA:', err);
  process.exit(1);
});
