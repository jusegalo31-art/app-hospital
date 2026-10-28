import React, { useState, useMemo } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Hand,
} from 'lucide-react';
import { CategoryType, SortCardItem, DariDialogue } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';
import { calculateChallenge1ItemPoints } from '../utils/scoring';
import {
  getDariChallenge1CardPrompt,
  getDariChallenge1Feedback,
} from '../data/dariDialogues';
import { IconBadge } from './IconBadge';
import { DariGuideBar } from './DariGuideBar';
import { GuideCharacterAvatar } from './Illustrations';

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
  // Índice de la tarjeta activa
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  // Tarjetas ya clasificadas correctamente (id -> categoría)
  const [completedMap, setCompletedMap] = useState<Record<string, CategoryType>>(
    {}
  );
  // Errores cometidos por tarjeta antes de acertar
  const [errorsMap, setErrorsMap] = useState<Record<string, number>>({});
  // Racha de aciertos seguidos para que Dari celebre el progreso
  const [consecutiveCorrect, setConsecutiveCorrect] = useState<number>(0);
  // Estado de selección táctil de la tarjeta actual
  const [isCardSelected, setIsCardSelected] = useState<boolean>(true);
  // Estado visual de arrastre sobre una zona
  const [dragOverZone, setDragOverZone] = useState<CategoryType | null>(null);
  // Retroalimentación actual y diálogo contextual de Dari
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

  // Diálogo contextual de Dari según el estado actual del reto
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
      // ¡Respuesta correcta!
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
      // Respuesta incorrecta -> Explicación amable de Dari y oportunidad de corregir
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

  const handleSelectPendingCard = (index: number) => {
    if (index === currentIndex) return;
    if (!isCurrentSolved && feedbackState?.type === 'correct') return;
    speech.stop();
    setFeedbackState(null);
    setCurrentIndex(index);
    setIsCardSelected(true);
  };

  // Soporte Drag and Drop HTML5 (sin interrumpir con audio durante el arrastre)
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

  const darCount = Object.values(completedMap).filter((v) => v === 'DAR').length;
  const recibirCount = Object.values(completedMap).filter(
    (v) => v === 'RECIBIR'
  ).length;

  return (
    <section
      className="screen-card challenge-screen"
      aria-labelledby="c1-heading"
    >
      {/* Encabezado y objetivo educativo en una frase */}
      <div className="challenge-header">
        <div className="challenge-badge-row">
          <span className="challenge-step-tag">RETO 1 DE 3</span>
          <span className="challenge-counter-tag">
            Tarjeta {currentIndex + 1} de {cards.length} ({completedCount}{' '}
            clasificadas)
          </span>
        </div>

        <h1 id="c1-heading" className="challenge-title">
          ¿Dónde va cada uno?
        </h1>

        <p className="challenge-learning-goal">
          <strong>Qué aprenderás:</strong> A diferenciar cuáles acciones son
          deberes que cumplimos (<strong>DAR</strong>) y cuáles son derechos que
          nos protegen (<strong>RECIBIR</strong>).
        </p>
      </div>

      {/* Avatar Guía Personal "Dari" con Diálogo Contextual y Controles de Voz */}
      <DariGuideBar
        dialogue={activeDariDialogue}
        speech={speech}
        compact
      />

      {/* Selector visual de las 6 tarjetas del reto */}
      <div
        className="card-deck-dots"
        role="tablist"
        aria-label="Progreso de tarjetas del Reto 1"
      >
        {cards.map((card, idx) => {
          const solvedCat = completedMap[card.id];
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Tarjeta ${idx + 1}: ${
                solvedCat ? `Clasificada en ${solvedCat}` : 'Pendiente'
              }`}
              onClick={() => handleSelectPendingCard(idx)}
              className={`deck-pill ${isCurrent ? 'deck-pill-current' : ''} ${
                solvedCat === 'DAR'
                  ? 'deck-pill-dar'
                  : solvedCat === 'RECIBIR'
                  ? 'deck-pill-recibir'
                  : ''
              }`}
            >
              <span>{idx + 1}</span>
              {solvedCat && <CheckCircle2 size={14} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Tarjeta Activa para Clasificar */}
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
          aria-label={`Tarjeta actual: ${currentCard.text}. ${
            isCurrentSolved
              ? `Clasificada correctamente en ${currentCard.category}`
              : 'Seleccionada. Ahora toca DAR o RECIBIR abajo, o arrástrala.'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsCardSelected(true);
            }
          }}
        >
          <div className="sort-card-top">
            <div className="sort-card-icon-circle">
              <IconBadge name={currentCard.icon} size={32} />
            </div>
            <div className="sort-card-hint-chip">
              <Hand size={16} aria-hidden="true" />
              <span>
                {isCurrentSolved
                  ? `¡Clasificada en ${currentCard.category}!`
                  : 'Tarjeta seleccionada · Elige su lugar abajo'}
              </span>
            </div>
          </div>

          <p className="sort-card-main-text">“{currentCard.text}”</p>
        </div>
      )}

      {/* Zonas de Destino (DAR vs RECIBIR) distinguidas por color, icono y etiqueta */}
      <div
        className="sort-zones-grid"
        role="group"
        aria-label="Categorías de destino: DAR (Mis deberes) o RECIBIR (Mis derechos)"
      >
        {/* ZONA 1: DAR — MIS DEBERES */}
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
          <div className="zone-header-row">
            <div className="zone-icon-badge zone-icon-dar">
              <HeartHandshake size={28} aria-hidden="true" />
            </div>
            <span className="zone-count-pill">{darCount} guardadas</span>
          </div>
          <div className="zone-titles">
            <span className="zone-main-title">DAR — Mis deberes</span>
            <span className="zone-sub-desc">
              Lo que debo cumplir y aportar
            </span>
          </div>
        </button>

        {/* ZONA 2: RECIBIR — MIS DERECHOS */}
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
          <div className="zone-header-row">
            <div className="zone-icon-badge zone-icon-recibir">
              <ShieldCheck size={28} aria-hidden="true" />
            </div>
            <span className="zone-count-pill">{recibirCount} guardadas</span>
          </div>
          <div className="zone-titles">
            <span className="zone-main-title">RECIBIR — Mis derechos</span>
            <span className="zone-sub-desc">
              Lo que tengo derecho a recibir
            </span>
          </div>
        </button>
      </div>

      {/* Panel de Retroalimentación Inmediata y Botón de Avance */}
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
          <div className="feedback-avatar-col">
            <GuideCharacterAvatar
              pose={feedbackState.dariDialogue.pose}
              isSpeaking={
                speech.isSpeaking &&
                speech.activeId === feedbackState.dariDialogue.id
              }
            />
          </div>

          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {feedbackState.type === 'correct' ? (
                <>
                  <CheckCircle2 size={22} aria-hidden="true" />
                  <strong>
                    ¡Acierto! Pertenece a {currentCard.category} (Letra{' '}
                    {currentCard.letter}: {currentCard.conceptTitle})
                  </strong>
                </>
              ) : (
                <>
                  <HelpCircle size={22} aria-hidden="true" />
                  <strong>
                    ¡Aprendamos juntos! Intenta con la otra categoría
                  </strong>
                </>
              )}
            </div>

            <p className="feedback-message-text">{feedbackState.message}</p>

            {feedbackState.type === 'incorrect' && (
              <p className="feedback-action-hint">
                👉 Toca ahora el botón{' '}
                <strong>
                  {currentCard.category === 'DAR'
                    ? 'DAR — Mis deberes'
                    : 'RECIBIR — Mis derechos'}
                </strong>{' '}
                para ubicar la tarjeta correctamente.
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
                    ? 'Siguiente tarjeta'
                    : '¡Completar Reto 1 y pasar al Reto 2!'}
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
