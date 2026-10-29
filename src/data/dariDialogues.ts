import {
  DariDialogue,
  SortCardItem,
  ScenarioItem,
  MatchPairItem,
} from '../types/game';

/**
 * Construye la ruta del audio neural humano colombiano pregenerado para cada diálogo.
 */
export function getColombianAudioPath(
  clipId: string,
  voiceFolder: 'gonzalo' | 'salome' = 'gonzalo'
): string {
  return `/recursos/audio/${voiceFolder}/${clipId}.mp3`;
}

/**
 * BANCO CENTRALIZADO DE DIÁLOGOS CONTEXTUALES DE "DARI"
 * Orientador Ciudadano del videojuego educativo "DAR Y RECIBIR"
 * E.S.E. Hospital Universitario Erasmo Meoz
 *
 * Todos los textos están redactados en español colombiano neutro, cálido,
 * respetuoso y conversacional, con audios neurales humanos (es-CO) integrados.
 */

export const DARI_CORE_DIALOGUES: Record<string, DariDialogue> = {
  // ================= PANTALLA DE BIENVENIDA =================
  welcome_greeting: {
    id: 'welcome_greeting',
    event: 'welcome_start',
    pose: 'welcome',
    speakerTitle: 'Dari • Tu guía en DAR Y RECIBIR',
    text: '¡Hola! Soy Dari y voy a acompañarte en esta pequeña aventura. Hoy vamos a descubrir algo muy importante: tus derechos como usuario del hospital y los deberes que nos ayudan a convivir con respeto. Jugaremos tres retos cortitos y, al final, conocerás tu resultado. ¿Empezamos?',
    preRecordedAudioUrl: getColombianAudioPath('welcome_greeting'),
  },

  welcome_instructions: {
    id: 'welcome_instructions',
    event: 'welcome_instructions',
    pose: 'explaining',
    speakerTitle: 'Dari • Cómo jugar paso a paso',
    text: '¡Muy bien! Es muy fácil jugar. Lee cada tarjeta y sigue las indicaciones que aparecen en pantalla. Si necesitas ayuda, puedes escucharme otra vez. Y recuerda: aquí estamos para aprender, así que no te preocupes si te equivocas.',
    preRecordedAudioUrl: getColombianAudioPath('welcome_instructions'),
  },

  // ================= RETO 1: ¿DÓNDE VA CADA UNO? =================
  c1_intro: {
    id: 'c1_intro',
    event: 'challenge_enter',
    pose: 'explaining',
    speakerTitle: 'Dari • Inicio del Reto 1',
    text: '¡Primer reto! Vamos a descubrir la diferencia entre DAR y RECIBIR. DAR nos recuerda nuestros deberes, como tratar a los demás con respeto. RECIBIR nos recuerda nuestros derechos, como recibir información clara sobre nuestra atención. Ahora, toca una tarjeta y llévala a la categoría correcta. ¡Vamos paso a paso!',
    preRecordedAudioUrl: getColombianAudioPath('c1_intro'),
  },

  c1_streak: {
    id: 'c1_streak',
    event: 'answer_correct',
    pose: 'happy',
    speakerTitle: 'Dari • ¡Vas muy bien!',
    text: '¡Lo estás haciendo muy bien! Ya estás aprendiendo a reconocer la diferencia entre tus derechos y tus deberes.',
    preRecordedAudioUrl: getColombianAudioPath('c1_streak'),
  },

  c1_transition: {
    id: 'c1_transition',
    event: 'challenge_transition',
    pose: 'celebrating',
    speakerTitle: 'Dari • ¡Reto 1 superado!',
    text: '¡Reto superado! Has aprendido algo nuevo sobre DAR y RECIBIR. Ahora vamos a ponerlo en práctica con situaciones cotidianas del hospital.',
    preRecordedAudioUrl: getColombianAudioPath('c1_transition'),
  },

  // ================= RETO 2: ¿QUÉ HARÍAS EN ESTA SITUACIÓN? =================
  c2_intro: {
    id: 'c2_intro',
    event: 'challenge_enter',
    pose: 'explaining',
    speakerTitle: 'Dari • Inicio del Reto 2',
    text: 'Ahora vamos a imaginar algunas situaciones que pueden ocurrir en el hospital. Lee cada caso y elige el derecho o el deber que corresponda. Piensa qué podría hacer una persona para recibir un trato respetuoso o cumplir sus deberes.',
    preRecordedAudioUrl: getColombianAudioPath('c2_intro'),
  },

  c2_transition: {
    id: 'c2_transition',
    event: 'challenge_transition',
    pose: 'celebrating',
    speakerTitle: 'Dari • ¡Situaciones completadas!',
    text: '¡Excelente trabajo resolviendo las situaciones cotidianas! Ya estamos listos para el tercer y último reto.',
    preRecordedAudioUrl: getColombianAudioPath('c2_transition'),
  },

  // ================= RETO 3: CONECTA Y COMPLETA =================
  c3_intro_g1: {
    id: 'c3_intro_g1',
    event: 'challenge_enter',
    pose: 'explaining',
    speakerTitle: 'Dari • Último reto (Grupo 1 de 2)',
    text: '¡Llegamos al último reto! Ahora vamos a conectar algunos conceptos con su significado. Por ejemplo, el consentimiento previo está relacionado con las decisiones informadas sobre los tratamientos y los estudios de investigación. Lee las tarjetas y busca las parejas correctas. ¡Ya casi terminamos!',
    preRecordedAudioUrl: getColombianAudioPath('c3_intro_g1'),
  },

  c3_intro_g2: {
    id: 'c3_intro_g2',
    event: 'challenge_transition',
    pose: 'happy',
    speakerTitle: 'Dari • Último grupo de parejas (Grupo 2 de 2)',
    text: '¡Muy bien! Completaste el primer grupo de conexiones. Vamos con las últimas tres parejas para conocer tu calificación final.',
    preRecordedAudioUrl: getColombianAudioPath('c3_intro_g2'),
  },

  // ================= RESULTADOS FINALES =================
  results_below_60: {
    id: 'results_below_60',
    event: 'game_result',
    pose: 'encouraging',
    speakerTitle: 'Dari • ¡Sigamos aprendiendo juntos!',
    text: '¡Buen esfuerzo! Todavía puedes aprender un poquito más. Necesitas obtener al menos 60 puntos para completar el juego. Vamos a repasar lo que te resultó más difícil y a intentarlo de nuevo. ¡Tú puedes!',
    preRecordedAudioUrl: getColombianAudioPath('results_below_60'),
  },

  results_passed_60: {
    id: 'results_passed_60',
    event: 'game_result',
    pose: 'celebrating',
    speakerTitle: 'Dari • ¡Felicitaciones por tu logro!',
    text: '¡Lo lograste! ¡Felicitaciones! Has completado el recorrido DAR Y RECIBIR. Ahora conoces mejor tus derechos como usuario y los deberes que ayudan a construir una atención respetuosa. Gracias por participar. ¡Recuerda que tus derechos son importantes!',
    preRecordedAudioUrl: getColombianAudioPath('results_passed_60'),
  },
};

/**
 * Genera el diálogo de Dari cuando el usuario observa una tarjeta en el Reto 1
 */
export function getDariChallenge1CardPrompt(
  card: SortCardItem,
  index: number,
  total: number
): DariDialogue {
  if (index === 0) {
    const clipId = `c1_prompt_first_${card.id}`;
    return {
      id: clipId,
      event: 'challenge_enter',
      pose: 'explaining',
      speakerTitle: 'Dari • Primer reto: DAR o RECIBIR',
      text: `${DARI_CORE_DIALOGUES.c1_intro.text} Mira esta primera tarjeta: “${card.text}”.`,
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    };
  }

  const clipId = `c1_prompt_${card.id}`;
  return {
    id: clipId,
    event: 'case_present',
    pose: 'listening',
    speakerTitle: `Dari • Tarjeta ${index + 1} de ${total}`,
    text: `Leamos esta tarjeta: “${card.text}”. ¿Crees que es un deber que debemos cumplir (DAR) o un derecho que podemos recibir (RECIBIR)?`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}

/**
 * Genera el diálogo de Dari cuando el usuario clasifica una tarjeta en el Reto 1
 */
export function getDariChallenge1Feedback(
  card: SortCardItem,
  isCorrect: boolean,
  consecutiveCorrectCount: number,
  isLastCard: boolean
): DariDialogue {
  if (isCorrect) {
    const isStreak = consecutiveCorrectCount >= 3 && !isLastCard;
    const streakNote = isStreak
      ? ' ¡Lo estás haciendo muy bien! Ya estás aprendiendo a reconocer tus derechos y deberes.'
      : isLastCard
      ? ' ¡Reto superado! Has aprendido algo nuevo. Ahora vamos a ponerlo en práctica con una situación cotidiana.'
      : '';

    const categoryExplanation =
      card.category === 'DAR'
        ? `¡Muy bien! Esa es la categoría correcta. Recuerda: ${card.text.toLowerCase()} es un deber (${card.letter} de DAR) que debemos procurar cumplir.`
        : `¡Muy bien! Esa es la categoría correcta. En la letra ${card.letter} de RECIBIR recordamos nuestro derecho a ${card.conceptTitle.toLowerCase()}.`;

    const clipId = isLastCard
      ? `c1_ok_last_${card.id}`
      : isStreak
      ? `c1_ok_streak_${card.id}`
      : `c1_ok_${card.id}`;

    return {
      id: clipId,
      event: isLastCard ? 'challenge_transition' : 'answer_correct',
      pose: isLastCard ? 'celebrating' : 'happy',
      speakerTitle: isLastCard
        ? 'Dari • ¡Reto 1 completado!'
        : `Dari • ¡Excelente! (${card.category} • Letra ${card.letter})`,
      text: `${categoryExplanation}${streakNote}`,
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    };
  }

  const targetTypeLabel =
    card.category === 'DAR' ? 'un deber (DAR)' : 'un derecho (RECIBIR)';
  const clipId = `c1_err_${card.id}`;

  return {
    id: clipId,
    event: 'answer_incorrect',
    pose: 'encouraging',
    speakerTitle: 'Dari • ¡Aprendamos juntos!',
    text: `¡No pasa nada! Estamos aquí para aprender. Esta tarjeta corresponde a ${targetTypeLabel}. ${card.incorrectFeedback.replace(
      '¡Vamos a aprenderlo juntos! ',
      ''
    )} ¡Toca el botón ${card.category} para continuar!`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}

/**
 * Diálogos contextuales de Dari al presentar cada situación del Reto 2
 */
export function getDariChallenge2ScenarioPrompt(
  scenario: ScenarioItem,
  index: number
): DariDialogue {
  const introPrefix =
    index === 0
      ? 'Ahora vamos a imaginar algunas situaciones que pueden ocurrir en el hospital. '
      : '';

  const customPromptsByScenario: Record<string, string> = {
    'caso-1-info':
      'Imagina que necesitas comprender mejor la información sobre tu atención. ¿Qué derecho te permite recibir información clara y confidencial? ¡Busca la respuesta!',
    'caso-2-consulta':
      'Piensa en cuando tienes una cita o examen programado en el hospital. ¿Qué deber del acrónimo DAR nos ayuda a que la atención sea segura y puntual?',
    'caso-3-inconformidad':
      'Si tienes una sugerencia o no estás de acuerdo con algún aspecto del servicio, tienes canales como el SIAU o los buzones. ¿Qué derecho puedes ejercer con respeto?',
    'caso-4-consentimiento':
      'Cuando te proponen un procedimiento médico o participar en una investigación, tu voz cuenta. ¿Qué derecho te permite decidir con información previa o pedir otra opinión médica?',
    'caso-5-trato-respetuoso':
      'En el hospital todas las personas merecen calidez humana, respeto por su cultura y ser llamadas por su propio nombre. ¿Cuál opción refleja este derecho?',
  };

  const specificPrompt =
    customPromptsByScenario[scenario.id] ||
    `${scenario.situationText} ${scenario.question}`;
  const clipId = `c2_prompt_${scenario.id}`;

  return {
    id: clipId,
    event: index === 0 ? 'challenge_enter' : 'case_present',
    pose: index === 0 ? 'explaining' : 'listening',
    speakerTitle: `Dari • ${scenario.title}`,
    text: `${introPrefix}${specificPrompt}`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}

/**
 * Diálogos contextuales de Dari al responder en el Reto 2
 */
export function getDariChallenge2Feedback(
  scenario: ScenarioItem,
  isCorrect: boolean,
  optionFeedback: string,
  isLastScenario: boolean,
  optionId?: string
): DariDialogue {
  if (isCorrect) {
    const customSuccessByScenario: Record<string, string> = {
      'caso-1-info':
        '¡Exactamente! Recibir información clara y confidencial es uno de tus derechos. Si algo no te queda claro, puedes solicitar con tranquilidad que te lo expliquen.',
      'caso-2-consulta':
        '¡Exactamente! Presentar documentación real y asistir puntualmente es nuestro primer deber en DAR. Así cuidamos el tiempo y la seguridad de todos.',
      'caso-3-inconformidad':
        '¡Muy bien! Expresar opiniones e inconformidades es tu derecho, y podemos ejercerlo en el SIAU o en los buzones manteniendo siempre un trato amable.',
      'caso-4-consentimiento':
        '¡Exactamente! Dar tu consentimiento previo e informado y poder solicitar una segunda opinión médica son derechos fundamentales sobre tu salud.',
      'caso-5-trato-respetuoso':
        '¡Así es! Conocer el nombre de quien te atiende, ser llamado por tu propio nombre y recibir un trato humanizado sin discriminación son tus derechos.',
    };

    const baseText = customSuccessByScenario[scenario.id] || optionFeedback;
    const transitionText = isLastScenario
      ? ' ¡Has superado el segundo reto! Vamos ahora al último reto para conectar lo aprendido.'
      : '';
    const clipId = `c2_ok_${scenario.id}`;

    return {
      id: clipId,
      event: isLastScenario ? 'challenge_transition' : 'answer_correct',
      pose: isLastScenario ? 'celebrating' : 'happy',
      speakerTitle: isLastScenario
        ? 'Dari • ¡Reto 2 superado!'
        : `Dari • ¡Respuesta correcta! (${scenario.categoryBadge})`,
      text: `${baseText}${transitionText}`,
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    };
  }

  const clipId = optionId ? `c2_err_${optionId}` : `c2_err_${scenario.id}`;

  return {
    id: clipId,
    event: 'answer_incorrect',
    pose: 'encouraging',
    speakerTitle: 'Dari • Pensemos juntos',
    text: `Casi lo tienes. Pensemos juntos: ¿estamos hablando de algo que la persona tiene derecho a recibir o de un deber que debe cumplir? ${optionFeedback}`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}

/**
 * Diálogos contextuales de Dari en el Reto 3 ("Verdadero o Falso")
 */
export function getDariChallenge3TrueFalsePrompt(
  item: MatchPairItem,
  index: number,
  total: number
): DariDialogue {
  if (index === 0) {
    const clipId = `c3_tf_first_${item.id}`;
    return {
      id: clipId,
      event: 'challenge_enter',
      pose: 'explaining',
      speakerTitle: 'Dari • Reto 3: Verdadero o Falso',
      text: `¡Llegamos al tercer y último reto: Verdadero o Falso! Analicemos esta afirmación sobre “${item.concept}”: “${item.statement}”. ¿Crees que es verdadero o falso?`,
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    };
  }

  const clipId = `c3_tf_prompt_${item.id}`;
  return {
    id: clipId,
    event: 'case_present',
    pose: 'listening',
    speakerTitle: `Dari • Afirmación ${index + 1} de ${total} (${item.concept})`,
    text: `Leamos esta afirmación sobre “${item.concept}”: “${item.statement}”. ¿Crees que es verdadero o falso?`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}

/**
 * Diálogo de Dari al acertar o equivocarse en una afirmación de Verdadero o Falso del Reto 3
 */
export function getDariChallenge3TrueFalseFeedback(
  item: MatchPairItem,
  isCorrect: boolean,
  isLastItem = false
): DariDialogue {
  if (isCorrect) {
    const clipId = `c3_tf_ok_${item.id}`;
    return {
      id: clipId,
      event: isLastItem ? 'challenge_transition' : 'answer_correct',
      pose: isLastItem ? 'celebrating' : 'happy',
      speakerTitle: isLastItem
        ? 'Dari • ¡Reto 3 completado!'
        : `Dari • ¡Respuesta correcta! (${item.category} • Letra ${item.letter})`,
      text: `¡Muy bien! ${item.successNote}`,
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    };
  }

  const clipId = `c3_tf_err_${item.id}`;
  return {
    id: clipId,
    event: 'answer_incorrect',
    pose: 'encouraging',
    speakerTitle: `Dari • Revisemos “${item.concept}”`,
    text: `¡No te preocupes, aprendamos juntos! ${item.hintOnError} Toca el botón ${
      item.isTrue ? 'Verdadero' : 'Falso'
    } para continuar.`,
    preRecordedAudioUrl: getColombianAudioPath(clipId),
  };
}
