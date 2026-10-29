import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Award,
} from 'lucide-react';
import { MatchPairItem, DariDialogue } from '../types/game';
import { calculateChallenge3ItemPoints } from '../utils/scoring';
import {
  getDariChallenge3TrueFalsePrompt,
  getDariChallenge3TrueFalseFeedback,
} from '../data/dariDialogues';
import { SpeechHook } from '../hooks/useSpeech';
import { IconBadge } from './IconBadge';
import { DariGuideBar } from './DariGuideBar';

interface Challenge3MatchProps {
  groups: [MatchPairItem[], MatchPairItem[]];
  speech: SpeechHook;
  onItemScored: (
    itemId: string,
    points: number,
    firstTryCorrect: boolean,
    missedPrincipleId?: string
  ) => void;
  onCompleteChallenge: () => void;
}

/**
 * RETO 3: VERDADERO O FALSO
 * Evalúa de forma ágil, clara e intuitiva los mismos 10 principios institucionales
 * de DAR (3 deberes) y RECIBIR (7 derechos) mediante 6 afirmaciones prácticas por partida.
 */
export const Challenge3Match: React.FC<Challenge3MatchProps> = ({
  groups,
  speech,
  onItemScored,
  onCompleteChallenge,
}) => {
  // Unificamos las 6 afirmaciones seleccionadas para la partida (3 Verdaderas y 3 Falsas)
  const statements = useMemo<MatchPairItem[]>(
    () => [...groups[0], ...groups[1]],
    [groups]
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [errorsMap, setErrorsMap] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'hint';
    chosenAnswer: boolean;
    title: string;
    message: string;
    dariDialogue: DariDialogue;
  } | null>(null);

  const currentItem = statements[currentIndex];
  const completedCount = Object.keys(solvedMap).length;
  const isCurrentSolved = Boolean(currentItem && solvedMap[currentItem.id]);
  const progressPct = Math.round((completedCount / statements.length) * 100);

  // Diálogo contextual de Dari según el estado actual
  const activeDariDialogue = useMemo<DariDialogue>(() => {
    if (feedback) {
      return feedback.dariDialogue;
    }
    if (currentItem) {
      return getDariChallenge3TrueFalsePrompt(
        currentItem,
        currentIndex,
        statements.length
      );
    }
    return getDariChallenge3TrueFalsePrompt(
      statements[0],
      0,
      statements.length
    );
  }, [feedback, currentItem, currentIndex, statements]);

  const handleAnswer = (chosenTruth: boolean) => {
    if (!currentItem || isCurrentSolved) return;

    speech.stop();

    const isCorrect = chosenTruth === currentItem.isTrue;
    const isLastItem = currentIndex + 1 >= statements.length;

    if (isCorrect) {
      const priorErrors = errorsMap[currentItem.id] || 0;
      const pointsEarned = calculateChallenge3ItemPoints(priorErrors);
      const firstTry = priorErrors === 0;

      setSolvedMap((prev) => ({
        ...prev,
        [currentItem.id]: true,
      }));

      const dariDialogue = getDariChallenge3TrueFalseFeedback(
        currentItem,
        true,
        isLastItem
      );

      setFeedback({
        type: 'correct',
        chosenAnswer: chosenTruth,
        title: `¡Respuesta correcta! (${currentItem.category} • Letra ${currentItem.letter}: ${currentItem.concept})`,
        message: currentItem.successNote,
        dariDialogue,
      });

      onItemScored(
        currentItem.id,
        pointsEarned,
        firstTry,
        firstTry ? undefined : currentItem.principleId
      );
    } else {
      const nextErrors = (errorsMap[currentItem.id] || 0) + 1;
      setErrorsMap((prev) => ({
        ...prev,
        [currentItem.id]: nextErrors,
      }));

      const dariDialogue = getDariChallenge3TrueFalseFeedback(
        currentItem,
        false,
        false
      );

      setFeedback({
        type: 'hint',
        chosenAnswer: chosenTruth,
        title: `¡Aprendamos juntos sobre "${currentItem.concept}"!`,
        message: currentItem.hintOnError,
        dariDialogue,
      });
    }
  };

  const handleNextStatement = () => {
    speech.stop();
    setFeedback(null);

    if (currentIndex + 1 < statements.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onCompleteChallenge();
    }
  };

  if (!currentItem) return null;

  const isDar = currentItem.category === 'DAR';

  return (
    <section
      className="screen-card challenge-screen"
      aria-labelledby="c3-heading"
    >
      {/* Cabecera limpia de progreso del Reto 3: Verdadero o Falso */}
      <div className="c1-top-progress-row">
        <span id="c3-heading" className="c1-card-step-text">
          Afirmación {currentIndex + 1} de {statements.length} • Verdadero o
          Falso
        </span>
        <span className="c1-progress-pct-text">Progreso: {progressPct}%</span>
      </div>

      <div className="c1-thin-bar" aria-hidden="true">
        <div
          className="c1-thin-bar-fill"
          style={{
            width: `${Math.max(
              Math.round(
                ((currentIndex + (isCurrentSolved ? 1 : 0)) /
                  statements.length) *
                  100
              ),
              8
            )}%`,
          }}
        />
      </div>

      {/* Guía compacta de Dari con voz humana colombiana */}
      <DariGuideBar dialogue={activeDariDialogue} speech={speech} compact />

      {/* Tarjeta de Afirmación (Verdadero o Falso) */}
      <article
        className={`tf-statement-card ${
          isDar ? 'tf-card-dar' : 'tf-card-recibir'
        } ${isCurrentSolved ? 'tf-card-solved' : ''}`}
        aria-labelledby="tf-concept-heading"
      >
        <div className="tf-statement-header">
          <div className="tf-statement-badges">
            <span
              className={`acrostic-badge ${
                isDar ? 'acrostic-dar' : 'acrostic-recibir'
              }`}
            >
              {isDar ? 'DAR • Deber' : 'RECIBIR • Derecho'} (Letra{' '}
              {currentItem.letter})
            </span>
            <strong id="tf-concept-heading" className="tf-concept-name">
              {currentItem.concept}
            </strong>
          </div>
          <IconBadge name={currentItem.icon} size={22} />
        </div>

        <p className="tf-statement-text">“{currentItem.statement}”</p>
      </article>

      {/* Botones Grandes de VERDADERO y FALSO (Zona del Pulgar) */}
      <div
        className="tf-buttons-grid"
        role="group"
        aria-label="Selecciona si la afirmación es Verdadera o Falsa"
      >
        <button
          type="button"
          disabled={isCurrentSolved}
          onClick={() => handleAnswer(true)}
          className={`tf-choice-btn tf-btn-true ${
            isCurrentSolved && currentItem.isTrue
              ? 'tf-btn-winner'
              : feedback?.type === 'hint' && feedback.chosenAnswer === true
              ? 'tf-btn-wrong'
              : ''
          }`}
          id="btn-tf-true"
          aria-label="Responder Verdadero"
        >
          <CheckCircle2 size={24} aria-hidden="true" />
          <span className="tf-btn-main-label">VERDADERO</span>
          <span className="tf-btn-sub-label">Sí es correcto</span>
        </button>

        <button
          type="button"
          disabled={isCurrentSolved}
          onClick={() => handleAnswer(false)}
          className={`tf-choice-btn tf-btn-false ${
            isCurrentSolved && !currentItem.isTrue
              ? 'tf-btn-winner'
              : feedback?.type === 'hint' && feedback.chosenAnswer === false
              ? 'tf-btn-wrong'
              : ''
          }`}
          id="btn-tf-false"
          aria-label="Responder Falso"
        >
          <XCircle size={24} aria-hidden="true" />
          <span className="tf-btn-main-label">FALSO</span>
          <span className="tf-btn-sub-label">No es así</span>
        </button>
      </div>

      {/* Retroalimentación Inmediata y Botón para Avanzar */}
      {feedback && (
        <div
          className={`feedback-banner ${
            feedback.type === 'correct'
              ? 'feedback-correct'
              : 'feedback-learning'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {feedback.type === 'correct' ? (
                <CheckCircle2 size={20} aria-hidden="true" />
              ) : (
                <HelpCircle size={20} aria-hidden="true" />
              )}
              <strong>{feedback.title}</strong>
            </div>

            <p className="feedback-message-text">{feedback.message}</p>

            {feedback.type === 'hint' && (
              <p className="feedback-action-hint">
                👉 Toca ahora el botón{' '}
                <strong>
                  {currentItem.isTrue ? 'VERDADERO' : 'FALSO'}
                </strong>{' '}
                para continuar.
              </p>
            )}

            {feedback.type === 'correct' && (
              <button
                type="button"
                onClick={handleNextStatement}
                className="btn-next-step"
                id="btn-c3-next"
              >
                {currentIndex + 1 < statements.length ? (
                  <>
                    <span>Siguiente Afirmación</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <Award size={19} aria-hidden="true" />
                    <span>¡VER MI CALIFICACIÓN FINAL!</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
