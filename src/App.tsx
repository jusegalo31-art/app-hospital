import React, { useState, useCallback, useRef } from 'react';
import {
  ScreenStage,
  ChallengeScoreDetail,
  SortCardItem,
  ScenarioItem,
  MatchPairItem,
} from './types/game';
import {
  generateChallenge1Cards,
  generateChallenge2Scenarios,
  generateChallenge3Groups,
} from './data/institutionalContent';
import { clampTotalScore } from './utils/scoring';
import { useSpeech } from './hooks/useSpeech';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Challenge1Sort } from './components/Challenge1Sort';
import { Challenge2Situations } from './components/Challenge2Situations';
import { Challenge3Match } from './components/Challenge3Match';
import { ResultsScreen } from './components/ResultsScreen';
import { ReferenceModal } from './components/ReferenceModal';

export const App: React.FC = () => {
  const speech = useSpeech();

  // Estado de navegación principal
  const [stage, setStage] = useState<ScreenStage>('welcome');
  // Clave de sesión para reiniciar todos los estados de los retos sin recargar la página
  const [sessionKey, setSessionKey] = useState<number>(1);
  // Modo de letra extra grande para accesibilidad visual
  const [largeText, setLargeText] = useState<boolean>(false);
  // Modal de cartilla institucional
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);

  // Datos generados para la partida actual
  const [c1Cards, setC1Cards] = useState<SortCardItem[]>(() =>
    generateChallenge1Cards()
  );
  const [c2Scenarios, setC2Scenarios] = useState<ScenarioItem[]>(() =>
    generateChallenge2Scenarios()
  );
  const [c3Groups, setC3Groups] = useState<[MatchPairItem[], MatchPairItem[]]>(
    () => generateChallenge3Groups()
  );

  // Control de ítems ya calificados en la partida actual (evita puntos infinitos)
  const scoredItemsRef = useRef<Set<string>>(new Set());

  // Estado de puntuación detallada
  const [scoreDetail, setScoreDetail] = useState<ChallengeScoreDetail>({
    challenge1Points: 0,
    challenge2Points: 0,
    challenge3Points: 0,
    totalScore: 0,
    challenge1CorrectFirstTry: 0,
    challenge1Total: 6,
    challenge2CorrectFirstTry: 0,
    challenge2Total: 5,
    challenge3CorrectFirstTry: 0,
    challenge3Total: 6,
    missedPrincipleIds: [],
  });

  // Contador de actividades resueltas para la barra de progreso (total 17 pasos)
  const [completedStepsCount, setCompletedStepsCount] = useState<number>(0);
  const totalGameSteps = 17; // 6 (Reto 1) + 5 (Reto 2) + 6 (Reto 3)

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Reinicia el estado de la partida para comenzar desde cero o volver a intentar
   */
  const resetAndStartNewGame = useCallback(
    (targetStage: ScreenStage = 'challenge1') => {
      speech.stop();
      scoredItemsRef.current = new Set();
      setC1Cards(generateChallenge1Cards());
      setC2Scenarios(generateChallenge2Scenarios());
      setC3Groups(generateChallenge3Groups());
      setCompletedStepsCount(0);
      setScoreDetail({
        challenge1Points: 0,
        challenge2Points: 0,
        challenge3Points: 0,
        totalScore: 0,
        challenge1CorrectFirstTry: 0,
        challenge1Total: 6,
        challenge2CorrectFirstTry: 0,
        challenge2Total: 5,
        challenge3CorrectFirstTry: 0,
        challenge3Total: 6,
        missedPrincipleIds: [],
      });
      setSessionKey((prev) => prev + 1);
      setStage(targetStage);
      scrollToTop();
    },
    [speech]
  );

  // Registro de puntos del Reto 1
  const handleChallenge1Scored = useCallback(
    (
      itemId: string,
      points: number,
      firstTryCorrect: boolean,
      missedPrincipleId?: string
    ) => {
      const uniqueKey = `c1-${itemId}`;
      if (scoredItemsRef.current.has(uniqueKey)) return;
      scoredItemsRef.current.add(uniqueKey);

      setCompletedStepsCount((prev) => prev + 1);
      setScoreDetail((prev) => {
        const nextC1 = prev.challenge1Points + points;
        const nextMissed =
          missedPrincipleId && !prev.missedPrincipleIds.includes(missedPrincipleId)
            ? [...prev.missedPrincipleIds, missedPrincipleId]
            : prev.missedPrincipleIds;

        return {
          ...prev,
          challenge1Points: nextC1,
          challenge1CorrectFirstTry:
            prev.challenge1CorrectFirstTry + (firstTryCorrect ? 1 : 0),
          totalScore: clampTotalScore(
            nextC1,
            prev.challenge2Points,
            prev.challenge3Points
          ),
          missedPrincipleIds: nextMissed,
        };
      });
    },
    []
  );

  // Registro de puntos del Reto 2
  const handleChallenge2Scored = useCallback(
    (
      itemId: string,
      points: number,
      firstTryCorrect: boolean,
      missedPrincipleId?: string
    ) => {
      const uniqueKey = `c2-${itemId}`;
      if (scoredItemsRef.current.has(uniqueKey)) return;
      scoredItemsRef.current.add(uniqueKey);

      setCompletedStepsCount((prev) => prev + 1);
      setScoreDetail((prev) => {
        const nextC2 = prev.challenge2Points + points;
        const nextMissed =
          missedPrincipleId && !prev.missedPrincipleIds.includes(missedPrincipleId)
            ? [...prev.missedPrincipleIds, missedPrincipleId]
            : prev.missedPrincipleIds;

        return {
          ...prev,
          challenge2Points: nextC2,
          challenge2CorrectFirstTry:
            prev.challenge2CorrectFirstTry + (firstTryCorrect ? 1 : 0),
          totalScore: clampTotalScore(
            prev.challenge1Points,
            nextC2,
            prev.challenge3Points
          ),
          missedPrincipleIds: nextMissed,
        };
      });
    },
    []
  );

  // Registro de puntos del Reto 3
  const handleChallenge3Scored = useCallback(
    (
      itemId: string,
      points: number,
      firstTryCorrect: boolean,
      missedPrincipleId?: string
    ) => {
      const uniqueKey = `c3-${itemId}`;
      if (scoredItemsRef.current.has(uniqueKey)) return;
      scoredItemsRef.current.add(uniqueKey);

      setCompletedStepsCount((prev) => prev + 1);
      setScoreDetail((prev) => {
        const nextC3 = prev.challenge3Points + points;
        const nextMissed =
          missedPrincipleId && !prev.missedPrincipleIds.includes(missedPrincipleId)
            ? [...prev.missedPrincipleIds, missedPrincipleId]
            : prev.missedPrincipleIds;

        return {
          ...prev,
          challenge3Points: nextC3,
          challenge3CorrectFirstTry:
            prev.challenge3CorrectFirstTry + (firstTryCorrect ? 1 : 0),
          totalScore: clampTotalScore(
            prev.challenge1Points,
            prev.challenge2Points,
            nextC3
          ),
          missedPrincipleIds: nextMissed,
        };
      });
    },
    []
  );

  const challengeProgressPercent = Math.min(
    100,
    (completedStepsCount / totalGameSteps) * 100
  );

  return (
    <div
      className={`app-shell ${largeText ? 'app-large-text' : ''}`}
      data-stage={stage}
    >
      <Header
        stage={stage}
        challengeProgressPercent={challengeProgressPercent}
        largeText={largeText}
        onToggleLargeText={() => setLargeText((prev) => !prev)}
        onOpenReference={() => setIsReferenceOpen(true)}
        onRestart={() => resetAndStartNewGame('welcome')}
      />

      <main className="app-main" id="main-content">
        {stage === 'welcome' && (
          <WelcomeScreen
            speech={speech}
            onStartGame={() => resetAndStartNewGame('challenge1')}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {stage === 'challenge1' && (
          <Challenge1Sort
            key={`c1-${sessionKey}`}
            cards={c1Cards}
            speech={speech}
            onItemScored={handleChallenge1Scored}
            onCompleteChallenge={() => {
              setStage('challenge2');
              scrollToTop();
            }}
          />
        )}

        {stage === 'challenge2' && (
          <Challenge2Situations
            key={`c2-${sessionKey}`}
            scenarios={c2Scenarios}
            speech={speech}
            onItemScored={handleChallenge2Scored}
            onCompleteChallenge={() => {
              setStage('challenge3');
              scrollToTop();
            }}
          />
        )}

        {stage === 'challenge3' && (
          <Challenge3Match
            key={`c3-${sessionKey}`}
            groups={c3Groups}
            speech={speech}
            onItemScored={handleChallenge3Scored}
            onCompleteChallenge={() => {
              setStage('results');
              scrollToTop();
            }}
          />
        )}

        {stage === 'results' && (
          <ResultsScreen
            key={`res-${sessionKey}`}
            scoreDetail={scoreDetail}
            speech={speech}
            onPlayAgain={() => resetAndStartNewGame('challenge1')}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}
      </main>

      <footer className="app-footer" role="contentinfo">
        <p className="footer-slogan">
          “Cumpliendo nuestros deberes garantizamos tus derechos” —{' '}
          <strong>E.S.E. Hospital Universitario Erasmo Meoz</strong>, ¡Un
          Hospital de Todos!
        </p>
        <p className="footer-privacy">
          Juego educativo gratuito • Sin recopilación de datos personales •
          Programa de Enfermería UFPS
        </p>
      </footer>

      <ReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        speech={speech}
      />
    </div>
  );
};

export default App;
