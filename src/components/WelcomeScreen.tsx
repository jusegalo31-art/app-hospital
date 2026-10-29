import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Activity,
  MessageSquare,
  Users,
  ExternalLink,
  Volume2,
  Square,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SpeechHook } from '../hooks/useSpeech';
import { DARI_CORE_DIALOGUES } from '../data/dariDialogues';
import { DariAvatar } from './DariAvatar';

interface WelcomeScreenProps {
  speech: SpeechHook;
  onStartGame: () => void;
  onOpenReference: (filter?: 'all' | 'DAR' | 'RECIBIR') => void;
  onOpenSiau?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  speech,
  onStartGame,
  onOpenReference,
  onOpenSiau,
}) => {
  const [tipMode, setTipMode] = useState<'greeting' | 'instructions'>(
    'greeting'
  );
  // Cuadro de texto de Dari comprimido por defecto con opción de expandir
  const [isQuoteExpanded, setIsQuoteExpanded] = useState<boolean>(false);

  const activeDialogue =
    tipMode === 'instructions'
      ? DARI_CORE_DIALOGUES.welcome_instructions
      : DARI_CORE_DIALOGUES.welcome_greeting;

  const isDariSpeaking =
    speech.isSpeaking &&
    (speech.activeId === activeDialogue.id ||
      speech.activeId === 'home_dari_welcome');

  const handleListenDari = () => {
    if (isDariSpeaking) {
      speech.stop();
      return;
    }
    speech.repeatCurrent(activeDialogue.text, activeDialogue.id, {
      preRecordedAudioUrl: activeDialogue.preRecordedAudioUrl,
    });
  };

  const handleToggleInstructions = () => {
    const nextMode = tipMode === 'greeting' ? 'instructions' : 'greeting';
    setTipMode(nextMode);
    setIsQuoteExpanded(true);
    const nextDialogue =
      nextMode === 'instructions'
        ? DARI_CORE_DIALOGUES.welcome_instructions
        : DARI_CORE_DIALOGUES.welcome_greeting;
    if (!speech.isMuted) {
      speech.speak(nextDialogue.text, nextDialogue.id, {
        preRecordedAudioUrl: nextDialogue.preRecordedAudioUrl,
      });
    }
  };

  const handleStart = () => {
    speech.stop();
    onStartGame();
  };

  return (
    <div
      className="mobile-home-view"
      aria-labelledby="welcome-main-title"
    >
      {/* 1. Tarjeta Principal de Bienvenida con Dari ("Tu Guía en Salud") */}
      <section
        className="home-hero-card dari-companion-card"
        aria-label="Bienvenida de Dari, tu guía en salud"
      >
        <div className="home-hero-top">
          <button
            type="button"
            onClick={handleListenDari}
            className="home-dari-touch-btn"
            title="Toca para escuchar a Dari con voz colombiana"
            aria-label={
              isDariSpeaking
                ? 'Detener voz de Dari'
                : 'Tocar para escuchar a Dari'
            }
          >
            <DariAvatar
              pose={activeDialogue.pose}
              isSpeaking={isDariSpeaking}
              size="lg"
            />
            <span className="home-dari-touch-label">
              {isDariSpeaking ? 'Hablando...' : 'Tócame'}
            </span>
          </button>

          <div className="home-hero-copy">
            <div className="home-hero-kicker-row">
              <span className="home-hero-kicker">TU GUÍA EN SALUD</span>
              <button
                type="button"
                onClick={handleListenDari}
                className={`btn-voice btn-home-listen btn-dari-listen ${
                  isDariSpeaking ? 'btn-home-listen-active' : ''
                }`}
                aria-label={
                  isDariSpeaking
                    ? 'Detener voz de Dari'
                    : 'Escuchar a Dari en voz alta'
                }
              >
                {isDariSpeaking ? (
                  <>
                    <Square size={13} fill="currentColor" aria-hidden="true" />
                    <span>Detener</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={14} aria-hidden="true" />
                    <span>Escuchar</span>
                  </>
                )}
              </button>
            </div>

            <h1 id="welcome-main-title" className="home-hero-title">
              “Cumpliendo nuestros deberes garantizamos tus derechos”
            </h1>

            <p className="home-hero-desc">
              En pocos minutos aprenderás de forma sencilla cómo ejercer tus{' '}
              <strong>7 derechos (RECIBIR)</strong> y cumplir tus{' '}
              <strong>3 deberes (DAR)</strong> en el hospital.
            </p>

            {/* Diálogo contextual escrito de Dari comprimido por defecto con opción de expandir */}
            <div
              className={`home-dari-quote-box ${
                isQuoteExpanded ? 'quote-box-expanded' : 'quote-box-collapsed'
              }`}
              role="status"
              aria-live="polite"
            >
              <div
                className="home-dari-quote-header"
                onClick={() => setIsQuoteExpanded((prev) => !prev)}
                role="button"
                tabIndex={0}
                aria-expanded={isQuoteExpanded}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsQuoteExpanded((prev) => !prev);
                  }
                }}
              >
                <p
                  className={`dari-bubble-text ${
                    isQuoteExpanded ? '' : 'dari-text-compressed'
                  }`}
                >
                  “{activeDialogue.text}”
                </p>
                <span className="btn-expand-dari-text">
                  {isQuoteExpanded ? (
                    <>
                      <span>Ocultar</span>
                      <ChevronUp size={14} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <span>Expandir</span>
                      <ChevronDown size={14} aria-hidden="true" />
                    </>
                  )}
                </span>
              </div>

              <div className="home-dari-quote-footer">
                <button
                  type="button"
                  onClick={handleToggleInstructions}
                  className="btn-dari-inline-tip"
                >
                  {tipMode === 'greeting'
                    ? '¿Cómo se juega? Ver explicación de Dari'
                    : 'Volver al saludo de Dari'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-hero-actions">
          <button
            type="button"
            onClick={handleStart}
            className="btn-home-primary"
            id="btn-start-game"
          >
            <span>Comenzar Reto Educativo</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onOpenReference('all')}
            className="btn-home-secondary"
          >
            <BookOpen size={17} aria-hidden="true" />
            <span>Ver Cartilla</span>
          </button>
        </div>
      </section>

      {/* 2. Estructura DAR y RECIBIR (10 Principios Clave) */}
      <section
        className="home-structure-section"
        aria-label="Estructura DAR y RECIBIR: 10 Principios Clave"
      >
        <div className="home-section-head">
          <h2 className="home-section-kicker">ESTRUCTURA DAR Y RECIBIR</h2>
          <span className="home-section-meta">10 Principios Clave</span>
        </div>

        <div className="home-pillars-cards">
          {/* Tarjeta DAR: Mis 3 Deberes (Azul Institucional HUEM) */}
          <div
            onClick={() => onOpenReference('DAR')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenReference('DAR');
              }
            }}
            role="button"
            tabIndex={0}
            className="home-pillar-card card-pillar-dar"
          >
            <div className="home-pillar-head">
              <div className="home-pillar-title-group">
                <span className="pillar-badge badge-dar">DAR</span>
                <strong className="pillar-name">Mis 3 Deberes</strong>
              </div>
              <span className="pillar-link-text link-dar">Ver →</span>
            </div>

            <p className="home-pillar-intro">
              Lo que aportamos para un ambiente seguro y respetuoso:
            </p>

            <ul className="home-pillar-list">
              <li>
                <FileText size={15} className="icon-dar" aria-hidden="true" />
                <span>
                  <strong>D</strong>ocumentación y puntualidad
                </span>
              </li>
              <li>
                <HeartHandshake
                  size={15}
                  className="icon-dar"
                  aria-hidden="true"
                />
                <span>
                  <strong>A</strong>mabilidad y trato respetuoso
                </span>
              </li>
              <li>
                <ShieldCheck
                  size={15}
                  className="icon-dar"
                  aria-hidden="true"
                />
                <span>
                  <strong>R</strong>econocimiento de las normas
                </span>
              </li>
            </ul>
          </div>

          {/* Tarjeta RECIBIR: Mis 7 Derechos (Verde Institucional HUEM) */}
          <div
            onClick={() => onOpenReference('RECIBIR')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenReference('RECIBIR');
              }
            }}
            role="button"
            tabIndex={0}
            className="home-pillar-card card-pillar-recibir"
          >
            <div className="home-pillar-head">
              <div className="home-pillar-title-group">
                <span className="pillar-badge badge-recibir">REC</span>
                <strong className="pillar-name">Mis 7 Derechos</strong>
              </div>
              <span className="pillar-link-text link-recibir">Ver →</span>
            </div>

            <p className="home-pillar-intro">
              Lo que te protege y garantiza una atención humanizada:
            </p>

            <ul className="home-pillar-list">
              <li>
                <Activity
                  size={15}
                  className="icon-recibir"
                  aria-hidden="true"
                />
                <span>
                  <strong>R</strong>ecibir atención integral y oportuna
                </span>
              </li>
              <li>
                <MessageSquare
                  size={15}
                  className="icon-recibir"
                  aria-hidden="true"
                />
                <span>
                  <strong>E</strong>xpresar opiniones e inconformidades
                </span>
              </li>
              <li>
                <Users size={15} className="icon-recibir" aria-hidden="true" />
                <span>
                  <strong>B</strong>eneficio de acompañamiento
                </span>
              </li>
            </ul>

            <p className="home-pillar-more">
              + Consentimiento, Información, Identificación y Trato Digno
            </p>
          </div>
        </div>
      </section>

      {/* 3. Resumen "Aprende Jugando en 3 Retos" (~ 4 minutos) */}
      <section
        className="home-steps-section"
        aria-label="Aprende jugando en 3 retos"
      >
        <div className="home-section-head">
          <h2 className="home-section-kicker">APRENDE JUGANDO EN 3 RETOS</h2>
          <span className="home-section-meta">~ 4 minutos · Sin registro</span>
        </div>

        <div className="home-steps-list">
          <div className="home-step-item">
            <span className="home-step-num">1</span>
            <div>
              <h3>¿Dónde va cada uno?</h3>
              <p>
                Clasifica situaciones reales entre DAR (deberes) y RECIBIR
                (derechos).
              </p>
            </div>
          </div>

          <div className="home-step-item">
            <span className="home-step-num">2</span>
            <div>
              <h3> ¿Qué harías en esta situación?</h3>
              <p>
                Aprende cómo actuar en consulta, urgencias, admisiones y canales
                del hospital.
              </p>
            </div>
          </div>

          <div className="home-step-item">
            <span className="home-step-num">3</span>
            <div>
              <h3>Verdadero o Falso y Certificado de Trato Digno</h3>
              <p>
                Pon a prueba lo aprendido respondiendo Verdadero o Falso sobre
                tus derechos y deberes, conoce tu calificación sobre 100 y
                genera tu insignia oficial.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="btn-home-start-inline"
        >
          Iniciar Reto 1 ahora →
        </button>
      </section>

      {/* 4. Tarjeta Rápida Canales de Atención SIAU */}
      <section
        className="home-siau-banner"
        aria-label="Canales de atención SIAU"
      >
        <div className="home-siau-texts">
          <span className="home-siau-kicker">CANALES DE ATENCIÓN SIAU</span>
          <p>Asignación de citas, dudas o peticiones respetuosas</p>
        </div>

        <button
          type="button"
          onClick={() =>
            onOpenSiau ? onOpenSiau() : onOpenReference('all')
          }
          className="btn-home-siau"
        >
          <span>Canales</span>
          <ExternalLink size={14} aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};
