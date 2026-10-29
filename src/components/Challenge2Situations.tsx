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
      {/* Cabecera limpia del caso clínico */}
      <div className="c1-top-progress-row">
        <span id="c2-heading" className="c1-card-step-text">
          Situación {currentIndex + 1} de {scenarios.length} •{' '}
          {currentScenario.categoryBadge}
        </span>
        <span className="c1-progress-pct-text">
          {Math.round(((currentIndex + (isCurrentSolved ? 1 : 0)) / scenarios.length) * 100)}%
        </span>
      </div>

      {/* Guía compacta de Dari con voz humana colombiana */}
      <DariGuideBar dialogue={activeDariDialogue} speech={speech} compact />

      {/* Tarjeta de Situación */}
      <article className="scenario-card" aria-labelledby="scenario-case-title">
        <span className="scenario-kicker">{currentScenario.title}</span>
        <p className="scenario-description">{currentScenario.situationText}</p>
        <div className="scenario-question-box">
          <strong id="scenario-case-title">{currentScenario.question}</strong>
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
                  <CheckCircle2 size={18} />
                ) : isTriedWrong ? (
                  <XCircle size={18} />
                ) : (
                  optionLetter
                )}
              </span>

              <span className="option-text-content">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Lección clave y retroalimentación */}
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
          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {selectedFeedback.type === 'correct' ? (
                <>
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <strong>
                    ¡Excelente decisión! ({currentScenario.categoryBadge})
                  </strong>
                </>
              ) : (
                <>
                  <HelpCircle size={20} aria-hidden="true" />
                  <strong>¡Revisemos esta opción juntos!</strong>
                </>
              )}
            </div>

            <p className="feedback-message-text">{selectedFeedback.feedback}</p>

            {selectedFeedback.reinforcementTip && (
              <div className="feedback-reinforcement-note">
                <Sparkles size={15} aria-hidden="true" />
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
                    ? 'Siguiente Situación'
                    : 'Ir al Reto 3 (Verdadero o Falso)'}
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
