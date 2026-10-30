import React, { useState, useCallback, useRef } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
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
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import { Header } from './components/Header';
import { BottomNav, MainTabId } from './components/BottomNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Challenge1Sort } from './components/Challenge1Sort';
import { Challenge2Situations } from './components/Challenge2Situations';
import { Challenge3Match } from './components/Challenge3Match';
import { ResultsScreen } from './components/ResultsScreen';
import { CartillaView } from './components/CartillaView';
import { SiauView } from './components/SiauView';
import { DariView } from './components/DariView';
import { ReferenceModal } from './components/ReferenceModal';

export const App: React.FC = () => {
  const speech = useSpeech();
  const bgMusic = useBackgroundMusic(speech.isSpeaking);

  // Pestaña activa de la barra inferior móvil (Inicio, Cartilla, Retos, SIAU, Dari)
  const [activeTab, setActiveTab] = useState<MainTabId>('inicio');
  // Filtro inicial para la Cartilla
  const [cartillaFilter, setCartillaFilter] = useState<
    'all' | 'DAR' | 'RECIBIR' | 'posters'
  >('all');
  // Etapa dentro del recorrido de Retos
  const [stage, setStage] = useState<ScreenStage>('welcome');
  // Clave de sesión para reiniciar retos sin recargar la página
  const [sessionKey, setSessionKey] = useState<number>(1);
  // Modo de letra grande accesible
  const [largeText, setLargeText] = useState<boolean>(false);
  // Modal de referencia rápida
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);
  // En pantallas de escritorio: alternar entre marco móvil (400px) o vista amplia
  const [isMobileFramed, setIsMobileFramed] = useState<boolean>(false);

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

  const scoredItemsRef = useRef<Set<string>>(new Set());
  const mainScrollRef = useRef<HTMLElement | null>(null);

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

  const [completedStepsCount, setCompletedStepsCount] = useState<number>(0);
  const totalGameSteps = 17;

  const scrollToTop = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
      setActiveTab(targetStage === 'welcome' ? 'inicio' : 'retos');
      scrollToTop();
    },
    [speech]
  );

  const handleSelectBottomTab = useCallback(
    (tab: MainTabId) => {
      speech.stop();
      setActiveTab(tab);
      if (tab === 'inicio') {
        setStage('welcome');
      } else if (tab === 'retos' && stage === 'welcome') {
        setStage('challenge1');
      }
      scrollToTop();
    },
    [speech, stage]
  );

  const handleOpenCartillaWithFilter = useCallback(
    (filter: 'all' | 'DAR' | 'RECIBIR' = 'all') => {
      speech.stop();
      setCartillaFilter(filter);
      setActiveTab('cartilla');
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

  const c1Done = scoreDetail.challenge1Points > 0 && stage !== 'challenge1';
  const c2Done = scoreDetail.challenge2Points > 0 && stage !== 'challenge2';
  const c3Done = stage === 'results';

  return (
    <div
      className={`app-outer-frame ${isMobileFramed ? 'frame-phone-mode' : ''}`}
    >
      {/* Barra superior opcional en pantallas de escritorio para alternar vista celular / completa */}
      <div className="desktop-preview-bar">
        <div className="desktop-preview-left">
          <span className="desktop-dot" />
          <strong>DAR Y RECIBIR • E.S.E. Hospital Universitario Erasmo Meoz</strong>
          <span className="desktop-sep">|</span>
          <span>Experiencia Móvil Interactiva • Voz Colombiana</span>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileFramed((prev) => !prev)}
          className="btn-desktop-frame-toggle"
        >
          {isMobileFramed ? (
            <>
              <Monitor size={14} aria-hidden="true" />
              <span>Vista Completa</span>
            </>
          ) : (
            <>
              <Smartphone size={14} aria-hidden="true" />
              <span>Enmarcar en Celular</span>
            </>
          )}
        </button>
      </div>

      {/* Contenedor Principal de la Aplicación */}
      <div
        className={`app-shell ${largeText ? 'app-large-text' : ''} ${
          isMobileFramed ? 'shell-phone-bezel' : ''
        }`}
        data-stage={stage}
        data-tab={activeTab}
      >
        <Header
          stage={activeTab === 'retos' ? stage : 'welcome'}
          challengeProgressPercent={challengeProgressPercent}
          largeText={largeText}
          onToggleLargeText={() => setLargeText((prev) => !prev)}
          onOpenReference={() => setIsReferenceOpen(true)}
          onRestart={() => resetAndStartNewGame('welcome')}
          speech={speech}
          bgMusic={bgMusic}
        />

        <main
          ref={mainScrollRef}
          className="app-main"
          id="main-content"
        >
          {/* PESTAÑA 1: INICIO */}
          {activeTab === 'inicio' && (
            <WelcomeScreen
              speech={speech}
              onStartGame={() => resetAndStartNewGame('challenge1')}
              onOpenReference={handleOpenCartillaWithFilter}
              onOpenSiau={() => handleSelectBottomTab('siau')}
            />
          )}

          {/* PESTAÑA 2: CARTILLA OFICIAL INTERACTIVA */}
          {activeTab === 'cartilla' && (
            <CartillaView
              key={`cartilla-${cartillaFilter}`}
              speech={speech}
              initialFilter={cartillaFilter}
            />
          )}

          {/* PESTAÑA 3: RETOS EDUCATIVOS Y CERTIFICADO */}
          {activeTab === 'retos' && (
            <div className="retos-tab-container">
              {/* Selector Superior de Retos (Diseño Móvil Intuitivo) */}
              <div
                className="retos-switcher-card"
                aria-label="Selector de retos educativos"
              >
                <div className="retos-switcher-head">
                  <span className="retos-switcher-kicker">
                    JUEGO EDUCATIVO • TRATO DIGNO
                  </span>
                  <span className="retos-switcher-score">
                    Puntos: {scoreDetail.totalScore}/100
                  </span>
                </div>

                <div className="retos-switcher-tabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={stage === 'challenge1'}
                    onClick={() => {
                      speech.stop();
                      setStage('challenge1');
                      scrollToTop();
                    }}
                    className={`reto-switch-btn ${
                      stage === 'challenge1' ? 'reto-switch-active' : ''
                    }`}
                  >
                    <span className="reto-switch-title">Reto 1</span>
                    <span className="reto-switch-sub">
                      {c1Done ? '✓ Completado' : 'Clasificador'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={stage === 'challenge2'}
                    onClick={() => {
                      speech.stop();
                      setStage('challenge2');
                      scrollToTop();
                    }}
                    className={`reto-switch-btn ${
                      stage === 'challenge2' ? 'reto-switch-active' : ''
                    }`}
                  >
                    <span className="reto-switch-title">Reto 2</span>
                    <span className="reto-switch-sub">
                      {c2Done ? '✓ Completado' : 'Casos Reales'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={
                      stage === 'challenge3' || stage === 'results'
                    }
                    onClick={() => {
                      speech.stop();
                      setStage(c3Done ? 'results' : 'challenge3');
                      scrollToTop();
                    }}
                    className={`reto-switch-btn ${
                      stage === 'challenge3' || stage === 'results'
                        ? 'reto-switch-active'
                        : ''
                    }`}
                  >
                    <span className="reto-switch-title">Reto 3</span>
                    <span className="reto-switch-sub">
                      {c3Done ? '✓ Insignia' : 'Verdadero o Falso'}
                    </span>
                  </button>
                </div>
              </div>

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
            </div>
          )}

          {/* PESTAÑA 4: CANALES SIAU */}
          {activeTab === 'siau' && <SiauView />}

          {/* PESTAÑA 5: CONVERSANDO CON DARI */}
          {activeTab === 'dari' && <DariView speech={speech} />}
        </main>

        {/* Barra de Navegación Inferior Móvil (Zona del Pulgar - 5 Pestañas) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectBottomTab}
          retosBadge={3}
        />

        <ReferenceModal
          isOpen={isReferenceOpen}
          onClose={() => setIsReferenceOpen(false)}
          speech={speech}
        />
      </div>
    </div>
  );
};

export default App;
