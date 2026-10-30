import React from 'react';
import { Type, Volume2, VolumeX, BookOpen, Music } from 'lucide-react';
import { ScreenStage } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';
import { BackgroundMusicHook } from '../hooks/useBackgroundMusic';

interface HeaderProps {
  stage: ScreenStage;
  challengeProgressPercent: number;
  largeText: boolean;
  onToggleLargeText: () => void;
  onOpenReference: () => void;
  onRestart: () => void;
  speech?: SpeechHook;
  bgMusic?: BackgroundMusicHook;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  challengeProgressPercent,
  largeText,
  onToggleLargeText,
  onOpenReference,
  onRestart,
  speech,
  bgMusic,
}) => {
  const isMuted = speech?.isMuted ?? false;
  const isMusicMuted = bgMusic?.isMusicMuted ?? false;

  return (
    <header className="compact-mobile-header" role="banner">
      <div className="compact-header-inner">
        {/* Ambos Logos Oficiales: Primero Universidad UFPS y después Hospital Universitario Erasmo Meoz */}
        <button
          type="button"
          onClick={onRestart}
          className="compact-brand-btn institutional-logos"
          title="Ir al inicio"
          aria-label="Universidad Francisco de Paula Santander y E.S.E. Hospital Universitario Erasmo Meoz - Ir al inicio"
        >
          <div className="compact-dual-logo-pill">
            <img
              src="/recursos/logo-ufps.png"
              alt="Logo Universidad Francisco de Paula Santander - Programa de Enfermería"
              className="compact-dual-logo-ufps"
            />
            <span className="compact-dual-logo-divider" aria-hidden="true" />
            <img
              src="/recursos/logo-hospital.jpeg"
              alt="Logo E.S.E. Hospital Universitario Erasmo Meoz"
              className="compact-dual-logo-huem"
            />
          </div>
        </button>

        {/* Controles compactos de accesibilidad, música de fondo y voz de Dari */}
        <div className="compact-header-actions">
          <button
            type="button"
            onClick={onOpenReference}
            className="compact-icon-btn header-cartilla-shortcut"
            title="Ver Cartilla Oficial DAR y RECIBIR"
            aria-label="Abrir cartilla de derechos y deberes"
          >
            <BookOpen size={17} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleLargeText}
            className={`compact-icon-btn ${
              largeText ? 'compact-icon-btn-active' : ''
            }`}
            aria-pressed={largeText}
            title={
              largeText
                ? 'Volver a tamaño de letra normal'
                : 'Activar letra grande para lectura fácil'
            }
            aria-label="Alternar tamaño de letra para accesibilidad"
          >
            <Type size={17} aria-hidden="true" />
          </button>

          {bgMusic && (
            <button
              type="button"
              onClick={bgMusic.toggleMusic}
              id="btn-bg-music-toggle"
              className={`compact-icon-btn ${
                isMusicMuted
                  ? 'compact-icon-btn-music-off'
                  : 'compact-icon-btn-music-on'
              }`}
              aria-pressed={!isMusicMuted}
              title={
                isMusicMuted
                  ? 'Encender música suave de fondo'
                  : 'Apagar música de fondo'
              }
              aria-label={
                isMusicMuted
                  ? 'Música de fondo apagada. Toca para encenderla'
                  : 'Música de fondo encendida. Toca para apagarla'
              }
            >
              <span className="music-icon-wrap">
                <Music size={16} aria-hidden="true" />
                {isMusicMuted && (
                  <span className="music-slash-line" aria-hidden="true" />
                )}
              </span>
            </button>
          )}

          {speech && (
            <button
              type="button"
              onClick={speech.toggleMute}
              className={`compact-icon-btn btn-dari-mute ${
                isMuted ? 'compact-icon-btn-muted' : 'compact-icon-btn-sound'
              }`}
              aria-pressed={isMuted}
              title={isMuted ? 'Activar voz de Dari' : 'Silenciar voz de Dari'}
              aria-label={
                isMuted
                  ? 'Audio desactivado. Toca para activar la voz de Dari'
                  : 'Audio activado. Toca para silenciar la voz de Dari'
              }
            >
              {isMuted ? (
                <VolumeX size={17} aria-hidden="true" />
              ) : (
                <Volume2 size={17} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Barra sutil de progreso cuando el usuario está dentro de los retos */}
      {stage !== 'welcome' && (
        <div
          className="compact-progress-strip"
          role="progressbar"
          aria-valuenow={Math.round(challengeProgressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso general del recorrido educativo"
        >
          <div
            className="compact-progress-fill"
            style={{ width: `${challengeProgressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
