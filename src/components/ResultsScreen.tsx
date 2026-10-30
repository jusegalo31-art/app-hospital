import React, { useState, useMemo } from 'react';
import {
  Award,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Volume2,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { ChallengeScoreDetail, DariDialogue } from '../types/game';
import { INSTITUTIONAL_PRINCIPLES } from '../data/institutionalContent';
import {
  DARI_CORE_DIALOGUES,
  getColombianAudioPath,
} from '../data/dariDialogues';
import {
  PASSING_SCORE,
  MAX_POINTS_CHALLENGE_1,
  MAX_POINTS_CHALLENGE_2,
  MAX_POINTS_CHALLENGE_3,
} from '../utils/scoring';
import { SpeechHook } from '../hooks/useSpeech';
import { IconBadge } from './IconBadge';
import { DariGuideBar } from './DariGuideBar';
import { DariAvatar } from './DariAvatar';

interface ResultsScreenProps {
  scoreDetail: ChallengeScoreDetail;
  speech: SpeechHook;
  onPlayAgain: () => void;
  onOpenReference: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  scoreDetail,
  speech,
  onPlayAgain,
  onOpenReference,
}) => {
  const isPassed = scoreDetail.totalScore >= PASSING_SCORE;
  const [showReviewPanel, setShowReviewPanel] = useState<boolean>(!isPassed);
  const [userName, setUserName] = useState<string>('');

  const missedPrinciples = INSTITUTIONAL_PRINCIPLES.filter((p) =>
    scoreDetail.missedPrincipleIds.includes(p.id)
  );

  const darPrinciples = INSTITUTIONAL_PRINCIPLES.filter(
    (p) => p.category === 'DAR'
  );
  const recibirPrinciples = INSTITUTIONAL_PRINCIPLES.filter(
    (p) => p.category === 'RECIBIR'
  );

  const badgeTitle =
    scoreDetail.totalScore >= 85
      ? 'Defensor del Trato Digno ⭐'
      : scoreDetail.totalScore >= PASSING_SCORE
      ? 'Usuario Comprometido 🌟'
      : 'Aprendiz Activo 🌱';

  const resultsDariDialogue = useMemo<DariDialogue>(() => {
    const base = isPassed
      ? DARI_CORE_DIALOGUES.results_passed_60
      : DARI_CORE_DIALOGUES.results_below_60;

    return {
      ...base,
      spokenText: isPassed
        ? `${base.text} Tu calificación final fue de ${scoreDetail.totalScore} sobre 100 puntos.`
        : `Obtuviste ${scoreDetail.totalScore} sobre 100 puntos. ${base.text}`,
    };
  }, [isPassed, scoreDetail.totalScore]);

  const handleRestartClick = () => {
    speech.stop();
    onPlayAgain();
  };

  const handleShareAchievement = () => {
    const text = `¡Logro conseguido! Soy un conocedor de los derechos y deberes en DAR y RECIBIR con ${scoreDetail.totalScore}/100 puntos (${badgeTitle}).`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: 'Logro Conseguido • DAR y RECIBIR',
          text,
        })
        .catch(() => {});
    }
  };

  return (
    <section
      className={`screen-card results-screen ${
        isPassed ? 'results-passed' : 'results-retry'
      }`}
      aria-labelledby="results-main-heading"
    >
      {/* Encabezado Celebración o Ánimo */}
      <div className="results-hero-banner">
        <div className="results-avatar-wrap">
          <DariAvatar
            pose={isPassed ? 'celebrating' : 'encouraging'}
            isSpeaking={
              speech.isSpeaking && speech.activeId === resultsDariDialogue.id
            }
            size="lg"
          />
          {isPassed && (
            <span className="celebration-sparkle" aria-hidden="true">
              <Sparkles size={22} />
            </span>
          )}
        </div>

        <span
          className={`results-status-pill ${
            isPassed ? 'status-pill-approved' : 'status-pill-retry'
          }`}
        >
          {isPassed ? (
            <>
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>¡APROBADO! APRENDIZAJE COMPLETADO</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} aria-hidden="true" />
              <span>META PARA APROBAR: 60 PUNTOS</span>
            </>
          )}
        </span>

        <h1 id="results-main-heading" className="results-title">
          {isPassed
            ? '¡Felicitaciones! Has completado el reto DAR Y RECIBIR'
            : '¡Sigamos aprendiendo! Aún puedes mejorar tu resultado'}
        </h1>

        <p className="results-subtitle">
          {isPassed
            ? 'Ahora conoces mejor tus derechos como usuario y los deberes que contribuyen a una atención respetuosa.'
            : 'Necesitas obtener 60 puntos o más sobre 100 para completar el juego. Recuerda que el objetivo es aprender, no competir.'}
        </p>
      </div>

      {/* Guía de Dari con voz colombiana */}
      <DariGuideBar dialogue={resultsDariDialogue} speech={speech} compact />

      {/* Marcador de Calificación sobre 100 */}
      <div
        className="score-scoreboard-card"
        role="region"
        aria-label={`Calificación final: ${scoreDetail.totalScore} sobre 100 puntos`}
      >
        <div className="score-circle-wrap">
          <div
            className={`score-circle ${
              isPassed ? 'score-circle-pass' : 'score-circle-retry'
            }`}
          >
            <Award size={24} aria-hidden="true" />
            <span className="score-big-number">{scoreDetail.totalScore}</span>
            <span className="score-out-of">de 100 puntos</span>
          </div>
        </div>

        <div className="score-breakdown-col">
          <h2 className="score-breakdown-title">
            Desglose transparente de tu aprendizaje
          </h2>
          <ul className="score-breakdown-list">
            <li>
              <span>Reto 1: ¿Dónde va cada uno?</span>
              <strong>
                {scoreDetail.challenge1Points} / {MAX_POINTS_CHALLENGE_1} pts
              </strong>
            </li>
            <li>
              <span>Reto 2: ¿Qué harías en esta situación?</span>
              <strong>
                {scoreDetail.challenge2Points} / {MAX_POINTS_CHALLENGE_2} pts
              </strong>
            </li>
            <li>
              <span>Reto 3: Verdadero o Falso</span>
              <strong>
                {scoreDetail.challenge3Points} / {MAX_POINTS_CHALLENGE_3} pts
              </strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Reconocimiento de Logro Conseguido (Sin nombres de instituciones, sin logos y sin la palabra certifica) */}
      {isPassed && (
        <div
          className="certificate-card-section"
          aria-label="Logro conseguido de derechos y deberes"
        >
          <div className="certificate-input-row">
            <label htmlFor="cert-user-name" className="certificate-label">
              Escribe tu nombre para personalizar tu logro (opcional):
            </label>
            <input
              id="cert-user-name"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Ej. María Gómez"
              className="certificate-name-input"
            />
          </div>

          <div className="certificate-diploma-box">
            <span className="achievement-kicker-pill">
              <Sparkles size={14} aria-hidden="true" />
              <span>¡LOGRO CONSEGUIDO!</span>
            </span>

            <h3 className="achievement-main-title">
              ¡Eres un conocedor de los derechos y deberes!
            </h3>

            <div className="certificate-recipient-block">
              {userName.trim() && (
                <strong className="certificate-recipient-name">
                  {userName.trim()}
                </strong>
              )}
              <p className="certificate-recipient-desc">
                Has superado con éxito los retos educativos de DAR y RECIBIR,
                demostrando que conoces tus 7 derechos (RECIBIR) y tus 3
                deberes (DAR) para promover siempre un trato digno, respetuoso
                y humanizado.
              </p>
            </div>

            <div className="certificate-badge-pill">
              <Award size={15} aria-hidden="true" />
              <span>{badgeTitle}</span>
            </div>

            <span className="certificate-date-foot">
              Puntaje: {scoreDetail.totalScore}/100 • Fecha:{' '}
              {new Date().toLocaleDateString('es-CO')}
            </span>
          </div>
        </div>
      )}

      {/* Botones Principales según Resultado (< 60 vs >= 60) */}
      <div className="results-actions-group">
        {!isPassed ? (
          <>
            <button
              type="button"
              onClick={handleRestartClick}
              className="btn-primary-xl"
              id="btn-retry-game"
            >
              <RotateCcw size={20} aria-hidden="true" />
              <span>VOLVER A INTENTAR · ¡Volver a intentarlo!</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReviewPanel((prev) => !prev)}
              className="btn-secondary-outline"
              id="btn-review-missed"
            >
              <BookOpen size={18} aria-hidden="true" />
              <span>
                {showReviewPanel
                  ? 'Ocultar repaso de conceptos'
                  : 'REPASAR LOS CONCEPTOS QUE MÁS ME COSTARON'}
              </span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleRestartClick}
              className="btn-primary-xl"
              id="btn-play-again"
            >
              <RotateCcw size={20} aria-hidden="true" />
              <span>JUGAR DE NUEVO</span>
            </button>

            <button
              type="button"
              onClick={onOpenReference}
              className="btn-secondary-outline"
              id="btn-review-rights"
            >
              <BookOpen size={18} aria-hidden="true" />
              <span>REPASAR MIS DERECHOS</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleShareAchievement}
                className="btn-secondary-outline"
              >
                <Share2 size={17} aria-hidden="true" />
                <span>Compartir Logro</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Si obtuvo menos de 60: Panel de repaso de los conceptos que más le costaron */}
      {!isPassed && showReviewPanel && (
        <div
          className="missed-concepts-box"
          role="region"
          aria-label="Conceptos recomendados para repasar antes de volver a intentar"
        >
          <h2 className="section-heading-sm">
            Conceptos recomendados por Dari para reforzar antes de tu nuevo
            intento:
          </h2>
          <div className="principles-summary-grid">
            {(missedPrinciples.length > 0
              ? missedPrinciples
              : INSTITUTIONAL_PRINCIPLES.slice(0, 4)
            ).map((item) => (
              <div
                key={item.id}
                className={`principle-summary-card ${
                  item.category === 'DAR' ? 'card-dar' : 'card-recibir'
                }`}
              >
                <div className="principle-card-top">
                  <span
                    className={`acrostic-badge ${
                      item.category === 'DAR'
                        ? 'acrostic-dar'
                        : 'acrostic-recibir'
                    }`}
                  >
                    {item.category} · Letra {item.letter}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      speech.toggleSpeak(
                        `${item.category}, letra ${item.letter}: ${item.shortTitle}. ${item.officialText}. ${item.citizenExplanation}`,
                        `principle_${item.id}`,
                        {
                          preRecordedAudioUrl: getColombianAudioPath(
                            `principle_${item.id}`
                          ),
                        }
                      )
                    }
                    className="btn-mini-audio"
                    aria-label={`Escuchar concepto ${item.shortTitle}`}
                  >
                    <Volume2 size={15} aria-hidden="true" />
                    <span>Escuchar</span>
                  </button>
                </div>
                <h3>{item.shortTitle}</h3>
                <p className="official-quote">
                  “{item.officialText.replace(/\.$/, '')}”.
                </p>
                <p className="citizen-note">{item.citizenExplanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen Visual Completo de los 3 Deberes (DAR) y 7 Derechos (RECIBIR) */}
      <div
        className="learned-summary-section"
        role="region"
        aria-label="Resumen visual de los derechos y deberes aprendidos"
      >
        <h2 className="learned-section-title">
          Resumen visual: Tus 3 Deberes (DAR) y 7 Derechos (RECIBIR)
        </h2>

        <div className="summary-category-block">
          <div className="summary-category-header header-dar">
            <HeartHandshake size={20} aria-hidden="true" />
            <h3>DAR — Mis 3 Deberes como Usuario</h3>
          </div>

          <div className="principles-summary-grid">
            {darPrinciples.map((item) => (
              <div key={item.id} className="principle-summary-card card-dar">
                <div className="principle-card-top">
                  <span className="acrostic-badge acrostic-dar">
                    DAR · {item.letter}
                  </span>
                  <IconBadge name={item.icon} size={18} />
                </div>
                <h4>{item.shortTitle}</h4>
                <p className="official-quote">{item.officialText}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-category-block">
          <div className="summary-category-header header-recibir">
            <ShieldCheck size={20} aria-hidden="true" />
            <h3>RECIBIR — Mis 7 Derechos como Usuario</h3>
          </div>

          <div className="principles-summary-grid">
            {recibirPrinciples.map((item) => (
              <div
                key={item.id}
                className="principle-summary-card card-recibir"
              >
                <div className="principle-card-top">
                  <span className="acrostic-badge acrostic-recibir">
                    RECIBIR · {item.letter}
                  </span>
                  <IconBadge name={item.icon} size={18} />
                </div>
                <h4>{item.shortTitle}</h4>
                <p className="official-quote">{item.officialText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
