import React from 'react';
import { Play, ShieldCheck, HeartHandshake, Sparkles, BookOpen } from 'lucide-react';
import { SpeechHook } from '../hooks/useSpeech';
import { DARI_CORE_DIALOGUES } from '../data/dariDialogues';
import { DariGuideBar } from './DariGuideBar';
import { WelcomeHeroIllustration } from './Illustrations';

interface WelcomeScreenProps {
  speech: SpeechHook;
  onStartGame: () => void;
  onOpenReference: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  speech,
  onStartGame,
  onOpenReference,
}) => {
  const handleStart = () => {
    speech.stop();
    onStartGame();
  };

  return (
    <section
      className="screen-card welcome-screen"
      aria-labelledby="welcome-main-title"
    >
      {/* Insignia institucional superior */}
      <div className="institutional-pill-row">
        <span className="hospital-tag">
          E.S.E. Hospital Universitario Erasmo Meoz • ¡Un Hospital de Todos!
        </span>
      </div>

      {/* Título y Subtítulo Oficiales */}
      <div className="welcome-header-block">
        <h1 id="welcome-main-title" className="game-title">
          DAR Y RECIBIR
        </h1>
        <p className="game-subtitle">
          ¡Conoce tus derechos, cumple tus deberes!
        </p>
      </div>

      {/* Avatar Guía Personal "Dari" con Saludo y Explicación Inicial */}
      <DariGuideBar
        dialogue={DARI_CORE_DIALOGUES.welcome_greeting}
        secondaryDialogue={DARI_CORE_DIALOGUES.welcome_instructions}
        secondaryButtonLabel="¿Cómo se juega? Ver explicación de Dari"
        speech={speech}
      />

      {/* Botón Principal Grande accesible sin desplazamiento excesivo */}
      <div className="welcome-cta-area">
        <button
          type="button"
          onClick={handleStart}
          className="btn-primary-xl"
          id="btn-start-game"
        >
          <Play size={24} fill="currentColor" aria-hidden="true" />
          <span>COMENZAR · ¡Vamos!</span>
        </button>
      </div>

      {/* Ilustración Sanitaria Amable */}
      <div className="welcome-illustration-wrap">
        <WelcomeHeroIllustration />
      </div>

      {/* Frase Introductoria Oficial */}
      <p className="welcome-intro-text">
        En pocos minutos descubrirás cómo ejercer tus derechos y contribuir a
        una atención respetuosa.
      </p>

      {/* Indicación Breve Obligatoria */}
      <div
        className="welcome-meta-badges"
        aria-label="Características del juego: 3 retos, menos de 5 minutos, sin registro"
      >
        <span className="meta-chip">
          <Sparkles size={17} aria-hidden="true" />
          3 retos · Menos de 5 minutos · Sin registro
        </span>
      </div>

      {/* Resumen Visual Breve del Acrónimo DAR Y RECIBIR */}
      <div className="welcome-pillars-grid" aria-label="Qué significa DAR y RECIBIR">
        <div className="pillar-box pillar-dar">
          <div className="pillar-icon-wrap">
            <HeartHandshake size={24} aria-hidden="true" />
          </div>
          <div className="pillar-text">
            <strong>DAR (Mis 3 Deberes)</strong>
            <span>
              <strong>D</strong>ocumentación y puntualidad ·{' '}
              <strong>A</strong>mabilidad y respeto ·{' '}
              <strong>R</strong>econocer las normas
            </span>
          </div>
        </div>

        <div className="pillar-box pillar-recibir">
          <div className="pillar-icon-wrap">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <div className="pillar-text">
            <strong>RECIBIR (Mis 7 Derechos)</strong>
            <span>
              <strong>R</strong>ecibir atención integral ·{' '}
              <strong>E</strong>xpresar opiniones ·{' '}
              <strong>C</strong>onsentimiento y 2.ª opinión ·{' '}
              <strong>I</strong>nformación clara ·{' '}
              <strong>B</strong>eneficio de acompañante ·{' '}
              <strong>I</strong>dentificación por nombre ·{' '}
              <strong>R</strong>espeto y trato humanizado
            </span>
          </div>
        </div>
      </div>

      {/* Acceso secundario a la cartilla completa */}
      <div className="welcome-secondary-cta">
        <button
          type="button"
          onClick={onOpenReference}
          className="btn-secondary-outline"
        >
          <BookOpen size={20} aria-hidden="true" />
          <span>Ver cartilla oficial y canales de atención SIAU</span>
        </button>
      </div>
    </section>
  );
};
