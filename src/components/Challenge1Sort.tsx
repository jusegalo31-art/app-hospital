import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { CategoryType, SortCardItem, DariDialogue } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';
import { calculateChallenge1ItemPoints } from '../utils/scoring';
import {
  getDariChallenge1CardPrompt,
  getDariChallenge1Feedback,
} from '../data/dariDialogues';
import { DariGuideBar } from './DariGuideBar';

interface Challenge1SortProps {
  cards: SortCardItem[];
  speech: SpeechHook;
  onItemScored: (
    itemId: string,
    points: number,
    firstTryCorrect: boolean,
    missedPrincipleId?: string
  ) => void;
  onCompleteChallenge: () => void;
}

export const Challenge1Sort: React.FC<Challenge1SortProps> = ({
  cards,
  speech,
  onItemScored,
  onCompleteChallenge,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedMap, setCompletedMap] = useState<Record<string, CategoryType>>(
    {}
  );
  const [errorsMap, setErrorsMap] = useState<Record<string, number>>({});
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  const [isCardSelected, setIsCardSelected] = useState<boolean>(true);
  const [dragOverZone, setDragOverZone] = useState<CategoryType | null>(null);
  const [feedbackState, setFeedbackState] = useState<{
    type: 'correct' | 'incorrect';
    chosenCategory: CategoryType;
    message: string;
    dariDialogue: DariDialogue;
  } | null>(null);

  const currentCard = cards[currentIndex];
  const completedCount = Object.keys(completedMap).length;
  const isCurrentSolved = Boolean(
    currentCard && completedMap[currentCard.id]
  );

  const progressPct = Math.round((completedCount / cards.length) * 100);

  const activeDariDialogue = useMemo<DariDialogue>(() => {
    if (feedbackState) {
      return feedbackState.dariDialogue;
    }
    if (currentCard) {
      return getDariChallenge1CardPrompt(
        currentCard,
        currentIndex,
        cards.length
      );
    }
    return getDariChallenge1CardPrompt(cards[0], 0, cards.length);
  }, [feedbackState, currentCard, currentIndex, cards]);

  const handleClassify = (chosenCategory: CategoryType) => {
    if (!currentCard || isCurrentSolved) return;

    speech.stop();

    if (chosenCategory === currentCard.category) {
      const priorErrors = errorsMap[currentCard.id] || 0;
      const pointsEarned = calculateChallenge1ItemPoints(priorErrors);
      const firstTry = priorErrors === 0;
      const nextStreak = consecutiveCorrect + 1;
      const isLastCard = currentIndex + 1 >= cards.length;

      setConsecutiveCorrect(nextStreak);
      setCompletedMap((prev) => ({
        ...prev,
        [currentCard.id]: chosenCategory,
      }));

      const dariFeedback = getDariChallenge1Feedback(
        currentCard,
        true,
        nextStreak,
        isLastCard
      );

      setFeedbackState({
        type: 'correct',
        chosenCategory,
        message: dariFeedback.text,
        dariDialogue: dariFeedback,
      });

      onItemScored(
        currentCard.id,
        pointsEarned,
        firstTry,
        firstTry ? undefined : currentCard.principleId
      );
    } else {
      setConsecutiveCorrect(0);
      const updatedErrors = (errorsMap[currentCard.id] || 0) + 1;
      setErrorsMap((prev) => ({
        ...prev,
        [currentCard.id]: updatedErrors,
      }));

      const dariFeedback = getDariChallenge1Feedback(
        currentCard,
        false,
        0,
        false
      );

      setFeedbackState({
        type: 'incorrect',
        chosenCategory,
        message: dariFeedback.text,
        dariDialogue: dariFeedback,
      });
    }
  };

  const handleNextCard = () => {
    speech.stop();
    setFeedbackState(null);
    setIsCardSelected(true);

    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onCompleteChallenge();
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!currentCard || isCurrentSolved) return;
    e.dataTransfer.setData('text/plain', currentCard.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsCardSelected(true);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLButtonElement>,
    zone: CategoryType
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverZone !== zone) {
      setDragOverZone(zone);
    }
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLButtonElement>,
    zone: CategoryType
  ) => {
    e.preventDefault();
    setDragOverZone(null);
    handleClassify(zone);
  };

  return (
    <section
      className="screen-card challenge-screen"
      aria-labelledby="c1-heading"
    >
      {/* Cabecera limpia de progreso de la tarjeta (Diseño Móvil Intuitivo) */}
      <div className="c1-top-progress-row">
        <span id="c1-heading" className="c1-card-step-text">
          Tarjeta {currentIndex + 1} de {cards.length}
        </span>
        <span className="c1-progress-pct-text">Progreso: {progressPct}%</span>
      </div>

      <div className="c1-thin-bar" aria-hidden="true">
        <div
          className="c1-thin-bar-fill"
          style={{
            width: `${Math.max(
              Math.round(((currentIndex + (isCurrentSolved ? 1 : 0)) / cards.length) * 100),
              8
            )}%`,
          }}
        />
      </div>

      {/* Guía compacta de Dari con voz humana colombiana */}
      <DariGuideBar dialogue={activeDariDialogue} speech={speech} compact />

      {/* Tarjeta Limpia "Situación a Clasificar" */}
      {currentCard && (
        <div
          className={`sort-active-card ${
            isCardSelected ? 'sort-card-selected' : ''
          } ${isCurrentSolved ? 'sort-card-solved' : ''}`}
          draggable={!isCurrentSolved}
          onDragStart={handleDragStart}
          onClick={() => setIsCardSelected(true)}
          role="button"
          tabIndex={0}
          aria-pressed={isCardSelected}
          aria-label={`Situación a clasificar: ${currentCard.text}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsCardSelected(true);
            }
          }}
        >
          <span className="sort-card-kicker">SITUACIÓN A CLASIFICAR</span>
          <p className="sort-card-main-text">
            “{currentCard.text.replace(/\.$/, '')}”.
          </p>
        </div>
      )}

      {/* Botones de Clasificación DAR (Azul Institucional) y RECIBIR (Verde Institucional) */}
      <div
        className="sort-zones-grid"
        role="group"
        aria-label="Categorías de destino: DAR (Mis deberes) o RECIBIR (Mis derechos)"
      >
        <button
          type="button"
          disabled={isCurrentSolved}
          onClick={() => handleClassify('DAR')}
          onDragOver={(e) => handleDragOver(e, 'DAR')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'DAR')}
          className={`drop-zone-btn zone-dar ${
            dragOverZone === 'DAR' ? 'zone-drag-over' : ''
          } ${
            isCurrentSolved && currentCard.category === 'DAR'
              ? 'zone-correct-highlight'
              : ''
          }`}
          aria-label="Clasificar en DAR: Mis deberes como usuario"
        >
          <span className="zone-main-title">DAR</span>
          <span className="zone-sub-desc">Mis Deberes</span>
        </button>

        <button
          type="button"
          disabled={isCurrentSolved}
          onClick={() => handleClassify('RECIBIR')}
          onDragOver={(e) => handleDragOver(e, 'RECIBIR')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'RECIBIR')}
          className={`drop-zone-btn zone-recibir ${
            dragOverZone === 'RECIBIR' ? 'zone-drag-over' : ''
          } ${
            isCurrentSolved && currentCard.category === 'RECIBIR'
              ? 'zone-correct-highlight'
              : ''
          }`}
          aria-label="Clasificar en RECIBIR: Mis derechos como usuario"
        >
          <span className="zone-main-title">RECIBIR</span>
          <span className="zone-sub-desc">Mis Derechos</span>
        </button>
      </div>

      {/* Retroalimentación Inmediata */}
      {feedbackState && (
        <div
          className={`feedback-banner ${
            feedbackState.type === 'correct'
              ? 'feedback-correct'
              : 'feedback-learning'
          }`}
          role="alert"
          aria-live="assertive"
        >
          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {feedbackState.type === 'correct' ? (
                <>
                  <CheckCircle2 size={20} aria-hidden="true" />
                  <strong>
                    ¡Excelente! ({currentCard.category} • Letra{' '}
                    {currentCard.letter}: {currentCard.conceptTitle})
                  </strong>
                </>
              ) : (
                <>
                  <HelpCircle size={20} aria-hidden="true" />
                  <strong>¡Ten presente! Aprendamos juntos</strong>
                </>
              )}
            </div>

            <p className="feedback-message-text">{feedbackState.message}</p>

            {feedbackState.type === 'incorrect' && (
              <p className="feedback-action-hint">
                👉 Toca ahora el botón{' '}
                <strong>
                  {currentCard.category === 'DAR'
                    ? 'DAR (Mis Deberes)'
                    : 'RECIBIR (Mis Derechos)'}
                </strong>{' '}
                para continuar.
              </p>
            )}

            {feedbackState.type === 'correct' && (
              <button
                type="button"
                onClick={handleNextCard}
                className="btn-next-step"
                id="btn-c1-next"
              >
                <span>
                  {currentIndex + 1 < cards.length
                    ? 'Siguiente Tarjeta'
                    : 'Continuar con Reto 2 (Casos Reales)'}
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
