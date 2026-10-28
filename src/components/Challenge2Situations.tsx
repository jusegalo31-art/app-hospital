import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { ScenarioItem, ScenarioOption, DariDialogue } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';
import { calculateChallenge2ItemPoints } from '../utils/scoring';
import {
  getDariChallenge2ScenarioPrompt,
  getDariChallenge2Feedback,
} from '../data/dariDialogues';
import { DariGuideBar } from './DariGuideBar';
import { ScenarioIllustration, GuideCharacterAvatar } from './Illustrations';

interface Challenge2SituationsProps {
  scenarios: ScenarioItem[];
  speech: SpeechHook;
  onItemScored: (
    itemId: string,
    points: number,
    firstTryCorrect: boolean,
    missedPrincipleId?: string
  ) => void;
  onCompleteChallenge: () => void;
}

export const Challenge2Situations: React.FC<Challenge2SituationsProps> = ({
  scenarios,
  speech,
  onItemScored,
  onCompleteChallenge,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});
  const [errorsMap, setErrorsMap] = useState<Record<string, number>>({});
  const [triedWrongIds, setTriedWrongIds] = useState<string[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<{
    type: 'correct' | 'incorrect';
    optionText: string;
    feedback: string;
    reinforcementTip?: string;
    dariDialogue: DariDialogue;
  } | null>(null);

  const currentScenario = scenarios[currentIndex];
  const isCurrentSolved = Boolean(
    currentScenario && solvedMap[currentScenario.id]
  );

  // Diálogo contextual de Dari según la situación o respuesta actual
  const activeDariDialogue = useMemo<DariDialogue>(() => {
    if (selectedFeedback) {
      return selectedFeedback.dariDialogue;
    }
    if (currentScenario) {
      return getDariChallenge2ScenarioPrompt(currentScenario, currentIndex);
    }
    return getDariChallenge2ScenarioPrompt(scenarios[0], 0);
  }, [selectedFeedback, currentScenario, currentIndex, scenarios]);

  const handleSelectOption = (option: ScenarioOption) => {
    if (!currentScenario || isCurrentSolved) return;

    speech.stop();

    const isLastScenario = currentIndex + 1 >= scenarios.length;

    if (option.isCorrect) {
      const priorErrors = errorsMap[currentScenario.id] || 0;
      const pointsEarned = calculateChallenge2ItemPoints(priorErrors);
      const firstTry = priorErrors === 0;

      setSolvedMap((prev) => ({
        ...prev,
        [currentScenario.id]: true,
      }));

      const dariDialogue = getDariChallenge2Feedback(
        currentScenario,
        true,
        option.feedback,
        isLastScenario
      );

      setSelectedFeedback({
        type: 'correct',
        optionText: option.text,
        feedback: dariDialogue.text,
        reinforcementTip: currentScenario.reinforcementTip,
        dariDialogue,
      });

      onItemScored(
        currentScenario.id,
        pointsEarned,
        firstTry,
        firstTry ? undefined : currentScenario.principleId
      );
    } else {
      if (!triedWrongIds.includes(option.id)) {
        setTriedWrongIds((prev) => [...prev, option.id]);
      }
      const nextErrors = (errorsMap[currentScenario.id] || 0) + 1;
      setErrorsMap((prev) => ({
        ...prev,
        [currentScenario.id]: nextErrors,
      }));

      const dariDialogue = getDariChallenge2Feedback(
        currentScenario,
        false,
        option.feedback,
        false,
        option.id
      );

      setSelectedFeedback({
        type: 'incorrect',
        optionText: option.text,
        feedback: dariDialogue.text,
        dariDialogue,
      });
    }
  };

  const handleNextScenario = () => {
    speech.stop();
    setSelectedFeedback(null);
    setTriedWrongIds([]);

    if (currentIndex + 1 < scenarios.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onCompleteChallenge();
    }
  };

  if (!currentScenario) return null;

  return (
    <section
      className="screen-card challenge-screen"
      aria-labelledby="c2-heading"
    >
      {/* Encabezado del reto */}
      <div className="challenge-header">
        <div className="challenge-badge-row">
          <span className="challenge-step-tag">RETO 2 DE 3</span>
          <span className="challenge-counter-tag">
            Situación {currentIndex + 1} de {scenarios.length}
          </span>
        </div>

        <h1 id="c2-heading" className="challenge-title">
          ¿Qué harías en esta situación?
        </h1>

        <p className="challenge-learning-goal">
          <strong>Qué aprenderás:</strong> A aplicar tus derechos (
          <strong>RECIBIR</strong>) y deberes (<strong>DAR</strong>) en
          situaciones cotidianas dentro del hospital.
        </p>
      </div>

      {/* Avatar Guía Personal "Dari" con Diálogo Contextual de la Situación */}
      <DariGuideBar
        dialogue={activeDariDialogue}
        speech={speech}
        compact
      />

      {/* Tarjeta de Escena Ilustrada */}
      <article className="scenario-card" aria-labelledby="scenario-case-title">
        <div className="scenario-illustration-box">
          <ScenarioIllustration type={currentScenario.illustrationType} />
        </div>

        <div className="scenario-body">
          <h2 id="scenario-case-title" className="scenario-title">
            {currentScenario.title}
          </h2>
          <p className="scenario-description">
            {currentScenario.situationText}
          </p>
          <div className="scenario-question-box">
            <strong>{currentScenario.question}</strong>
          </div>
        </div>
      </article>

      {/* Opciones Táctiles */}
      <div
        className="scenario-options-list"
        role="group"
        aria-label={currentScenario.question}
      >
        {currentScenario.options.map((option, idx) => {
          const isTriedWrong = triedWrongIds.includes(option.id);
          const isWinner = isCurrentSolved && option.isCorrect;
          const optionLetter = ['A', 'B', 'C'][idx] || `${idx + 1}`;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isCurrentSolved || isTriedWrong}
              onClick={() => handleSelectOption(option)}
              className={`scenario-option-btn ${
                isWinner ? 'option-btn-correct' : ''
              } ${isTriedWrong ? 'option-btn-wrong' : ''}`}
              aria-label={`Opción ${optionLetter}: ${option.text}`}
            >
              <span className="option-letter-badge" aria-hidden="true">
                {isWinner ? (
                  <CheckCircle2 size={22} />
                ) : isTriedWrong ? (
                  <XCircle size={22} />
                ) : (
                  optionLetter
                )}
              </span>

              <span className="option-text-content">{option.text}</span>

              {isWinner && (
                <span className="option-status-tag tag-correct">¡Correcto!</span>
              )}
              {isTriedWrong && (
                <span className="option-status-tag tag-wrong">Revisada</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Retroalimentación Progresiva y Botón de Avance */}
      {selectedFeedback && (
        <div
          className={`feedback-banner ${
            selectedFeedback.type === 'correct'
              ? 'feedback-correct'
              : 'feedback-learning'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="feedback-avatar-col">
            <GuideCharacterAvatar
              pose={selectedFeedback.dariDialogue.pose}
              isSpeaking={
                speech.isSpeaking &&
                speech.activeId === selectedFeedback.dariDialogue.id
              }
            />
          </div>

          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {selectedFeedback.type === 'correct' ? (
                <>
                  <CheckCircle2 size={22} aria-hidden="true" />
                  <strong>
                    ¡Excelente decisión! ({currentScenario.categoryBadge})
                  </strong>
                </>
              ) : (
                <>
                  <HelpCircle size={22} aria-hidden="true" />
                  <strong>¡Revisemos esta opción juntos!</strong>
                </>
              )}
            </div>

            <p className="feedback-message-text">{selectedFeedback.feedback}</p>

            {selectedFeedback.reinforcementTip && (
              <div className="feedback-reinforcement-note">
                <Sparkles size={17} aria-hidden="true" />
                <span>{selectedFeedback.reinforcementTip}</span>
              </div>
            )}

            {selectedFeedback.type === 'incorrect' && (
              <p className="feedback-action-hint">
                👉 Elige otra opción arriba para encontrar la respuesta correcta.
              </p>
            )}

            {selectedFeedback.type === 'correct' && (
              <button
                type="button"
                onClick={handleNextScenario}
                className="btn-next-step"
                id="btn-c2-next"
              >
                <span>
                  {currentIndex + 1 < scenarios.length
                    ? 'Siguiente situación'
                    : '¡Completar Reto 2 y pasar al Reto 3!'}
                </span>
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
