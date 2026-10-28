import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Link2,
  ArrowRight,
  Award,
} from 'lucide-react';
import { MatchPairItem, DariDialogue } from '../types/game';
import { shuffleArray } from '../data/institutionalContent';
import { calculateChallenge3ItemPoints } from '../utils/scoring';
import {
  getDariChallenge3Prompt,
  getDariChallenge3Feedback,
} from '../data/dariDialogues';
import { SpeechHook } from '../hooks/useSpeech';
import { IconBadge } from './IconBadge';
import { DariGuideBar } from './DariGuideBar';
import { GuideCharacterAvatar } from './Illustrations';

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

export const Challenge3Match: React.FC<Challenge3MatchProps> = ({
  groups,
  speech,
  onItemScored,
  onCompleteChallenge,
}) => {
  const [groupIndex, setGroupIndex] = useState<0 | 1>(0);
  const currentGroup = groups[groupIndex];

  // Descripciones barajadas para el grupo actual
  const shuffledDescriptions = useMemo(
    () => shuffleArray(currentGroup),
    [currentGroup]
  );

  // Concepto seleccionado actualmente
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    currentGroup[0]?.id || null
  );

  // Mapa de conceptos ya emparejados correctamente (id -> orden de pareja 1, 2, 3)
  const [matchedOrderMap, setMatchedOrderMap] = useState<Record<string, number>>(
    {}
  );

  // Errores por concepto
  const [errorsMap, setErrorsMap] = useState<Record<string, number>>({});

  // Retroalimentación actual y diálogo de Dari
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'hint';
    title: string;
    message: string;
    dariDialogue: DariDialogue;
  } | null>(null);

  const matchedInCurrentGroup = currentGroup.filter(
    (item) => matchedOrderMap[item.id] !== undefined
  ).length;
  const isGroupCompleted = matchedInCurrentGroup === currentGroup.length;

  const selectedConceptObj =
    currentGroup.find((c) => c.id === selectedConceptId) || null;

  // Diálogo contextual de Dari según el estado actual
  const activeDariDialogue = useMemo<DariDialogue>(() => {
    if (isGroupCompleted) {
      return getDariChallenge3Prompt(groupIndex, null, true, matchedInCurrentGroup);
    }
    if (feedback) {
      return feedback.dariDialogue;
    }
    return getDariChallenge3Prompt(
      groupIndex,
      selectedConceptObj,
      isGroupCompleted,
      matchedInCurrentGroup
    );
  }, [isGroupCompleted, feedback, groupIndex, selectedConceptObj, matchedInCurrentGroup]);

  const handleSelectConcept = (item: MatchPairItem) => {
    if (matchedOrderMap[item.id] !== undefined) return;
    speech.stop();
    setSelectedConceptId(item.id);
    setFeedback(null);
  };

  const handleSelectDescription = (descItem: MatchPairItem) => {
    if (matchedOrderMap[descItem.id] !== undefined) return;

    speech.stop();

    if (!selectedConceptId) {
      return;
    }

    const activeConcept = currentGroup.find((c) => c.id === selectedConceptId);
    if (!activeConcept) return;

    if (activeConcept.id === descItem.id) {
      // ¡Pareja correcta!
      const priorErrors = errorsMap[activeConcept.id] || 0;
      const pointsEarned = calculateChallenge3ItemPoints(priorErrors);
      const firstTry = priorErrors === 0;
      const nextPairBadgeNumber = matchedInCurrentGroup + 1;

      const updatedMatches = {
        ...matchedOrderMap,
        [activeConcept.id]: nextPairBadgeNumber,
      };
      setMatchedOrderMap(updatedMatches);

      const dariDialogue = getDariChallenge3Feedback(activeConcept, true);

      setFeedback({
        type: 'correct',
        title: `¡Conexión correcta! (${activeConcept.category} • Letra ${activeConcept.letter})`,
        message: dariDialogue.text,
        dariDialogue,
      });

      onItemScored(
        activeConcept.id,
        pointsEarned,
        firstTry,
        firstTry ? undefined : activeConcept.principleId
      );

      // Seleccionar automáticamente el siguiente concepto pendiente del grupo
      const nextPending = currentGroup.find(
        (c) => updatedMatches[c.id] === undefined
      );
      setSelectedConceptId(nextPending ? nextPending.id : null);
    } else {
      // Error -> mostrar pista amable de Dari para el concepto seleccionado
      const nextErrors = (errorsMap[activeConcept.id] || 0) + 1;
      setErrorsMap((prev) => ({
        ...prev,
        [activeConcept.id]: nextErrors,
      }));

      const dariDialogue = getDariChallenge3Feedback(activeConcept, false);

      setFeedback({
        type: 'hint',
        title: `¡Casi! Revisemos el concepto "${activeConcept.concept}"`,
        message: dariDialogue.text,
        dariDialogue,
      });
    }
  };

  const handleAdvanceGroup = () => {
    speech.stop();
    setFeedback(null);

    if (groupIndex === 0) {
      setGroupIndex(1);
      setSelectedConceptId(groups[1][0]?.id || null);
    } else {
      onCompleteChallenge();
    }
  };

  return (
    <section
      className="screen-card challenge-screen"
      aria-labelledby="c3-heading"
    >
      {/* Encabezado */}
      <div className="challenge-header">
        <div className="challenge-badge-row">
          <span className="challenge-step-tag">RETO 3 DE 3</span>
          <span className="challenge-counter-tag">
            Grupo {groupIndex + 1} de 2 ({matchedInCurrentGroup} de{' '}
            {currentGroup.length} conectados)
          </span>
        </div>

        <h1 id="c3-heading" className="challenge-title">
          Conecta y completa
        </h1>

        <p className="challenge-learning-goal">
          <strong>Qué aprenderás:</strong> A relacionar cada palabra clave de{' '}
          <strong>DAR Y RECIBIR</strong> con su significado práctico en tu
          atención hospitalaria.
        </p>
      </div>

      {/* Avatar Guía Personal "Dari" con Diálogo Contextual */}
      <DariGuideBar
        dialogue={activeDariDialogue}
        speech={speech}
        compact
      />

      {/* Instrucción rápida de interacción */}
      <div className="match-step-guide" role="status">
        <Link2 size={20} aria-hidden="true" />
        <span>
          {isGroupCompleted ? (
            <strong>
              ¡Grupo {groupIndex + 1} completado! Toca el botón de abajo para
              continuar.
            </strong>
          ) : selectedConceptObj ? (
            <>
              <strong>Paso 1 listo:</strong> Elegiste{' '}
              <span className="highlight-inline">
                “{selectedConceptObj.concept}”
              </span>
              . <strong>Paso 2:</strong> Toca abajo su descripción correcta.
            </>
          ) : (
            'Paso 1: Toca un concepto arriba. Paso 2: Toca su definición abajo.'
          )}
        </span>
      </div>

      {/* Columna 1: Conceptos */}
      <div className="match-section-block">
        <h2 className="match-section-subtitle">
          1. Conceptos clave (Toca uno para seleccionarlo)
        </h2>

        <div
          className="match-concepts-grid"
          role="group"
          aria-label="Conceptos clave para conectar"
        >
          {currentGroup.map((item) => {
            const pairNum = matchedOrderMap[item.id];
            const isMatched = pairNum !== undefined;
            const isSelected = selectedConceptId === item.id && !isMatched;

            return (
              <button
                key={item.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleSelectConcept(item)}
                className={`match-concept-card ${
                  isSelected ? 'concept-card-selected' : ''
                } ${isMatched ? 'concept-card-matched' : ''} ${
                  item.category === 'DAR' ? 'border-dar' : 'border-recibir'
                }`}
                aria-pressed={isSelected}
                aria-label={`Concepto ${item.concept}, categoría ${
                  item.category
                }, letra ${item.letter}. ${
                  isMatched
                    ? `Conectado con pareja número ${pairNum}`
                    : isSelected
                    ? 'Seleccionado actualmente'
                    : 'Toca para seleccionar'
                }`}
              >
                <div className="concept-card-header">
                  <span
                    className={`acrostic-badge ${
                      item.category === 'DAR'
                        ? 'acrostic-dar'
                        : 'acrostic-recibir'
                    }`}
                  >
                    {item.category} · {item.letter}
                  </span>

                  {isMatched ? (
                    <span className="pair-number-badge">
                      <CheckCircle2 size={15} aria-hidden="true" />
                      Par {pairNum}
                    </span>
                  ) : (
                    <IconBadge name={item.icon} size={22} />
                  )}
                </div>

                <span className="concept-card-title">{item.concept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Columna 2: Descripciones */}
      <div className="match-section-block">
        <h2 className="match-section-subtitle">
          2. Descripciones (Toca la que corresponde al concepto elegido)
        </h2>

        <div
          className="match-descriptions-list"
          role="group"
          aria-label="Descripciones para conectar con el concepto seleccionado"
        >
          {shuffledDescriptions.map((descItem) => {
            const pairNum = matchedOrderMap[descItem.id];
            const isMatched = pairNum !== undefined;

            return (
              <button
                key={descItem.id}
                type="button"
                disabled={isMatched}
                onClick={() => handleSelectDescription(descItem)}
                className={`match-desc-card ${
                  isMatched ? 'desc-card-matched' : ''
                }`}
                aria-label={`Descripción: ${descItem.description}. ${
                  isMatched
                    ? `Conectada con ${descItem.concept} (Par ${pairNum})`
                    : 'Toca para conectar con el concepto seleccionado'
                }`}
              >
                <div className="desc-card-left">
                  {isMatched ? (
                    <span className="pair-number-badge pair-badge-lg">
                      <CheckCircle2 size={18} aria-hidden="true" />
                      Par {pairNum}: {descItem.concept}
                    </span>
                  ) : (
                    <span className="desc-tap-prompt">Conectar aquí</span>
                  )}
                </div>

                <p className="desc-card-text">{descItem.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Retroalimentación Educativa o Pista */}
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
          <div className="feedback-avatar-col">
            <GuideCharacterAvatar
              pose={feedback.dariDialogue.pose}
              isSpeaking={
                speech.isSpeaking &&
                speech.activeId === feedback.dariDialogue.id
              }
            />
          </div>

          <div className="feedback-content-col">
            <div className="feedback-title-row">
              {feedback.type === 'correct' ? (
                <CheckCircle2 size={22} aria-hidden="true" />
              ) : (
                <HelpCircle size={22} aria-hidden="true" />
              )}
              <strong>{feedback.title}</strong>
            </div>

            <p className="feedback-message-text">{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Botón para avanzar al Grupo 2 o ver Resultados Finales */}
      {isGroupCompleted && (
        <div className="challenge-footer-cta">
          <button
            type="button"
            onClick={handleAdvanceGroup}
            className="btn-primary-xl"
            id="btn-c3-next"
          >
            {groupIndex === 0 ? (
              <>
                <span>Continuar al Grupo 2 de 2</span>
                <ArrowRight size={24} aria-hidden="true" />
              </>
            ) : (
              <>
                <Award size={24} aria-hidden="true" />
                <span>¡VER MI CALIFICACIÓN FINAL!</span>
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
