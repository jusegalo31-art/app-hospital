import React from 'react';
import { Type, Volume2, VolumeX, BookOpen } from 'lucide-react';
import { ScreenStage } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';

interface HeaderProps {
  stage: ScreenStage;
  challengeProgressPercent: number;
  largeText: boolean;
  onToggleLargeText: () => void;
  onOpenReference: () => void;
  onRestart: () => void;
  speech?: SpeechHook;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  challengeProgressPercent,
  largeText,
  onToggleLargeText,
  onOpenReference,
  onRestart,
  speech,
}) => {
  const isMuted = speech?.isMuted ?? false;

  return (
    <header className="compact-mobile-header" role="banner">
      <div className="compact-header-inner">
        {/* Identidad Institucional con el Logo de la Universidad (UFPS Enfermería) */}
        <button
          type="button"
          onClick={onRestart}
          className="compact-brand-btn institutional-logos"
          title="Ir al inicio de DAR y RECIBIR"
          aria-label="Universidad Francisco de Paula Santander - Programa de Enfermería - Ir al inicio"
        >
          <div className="compact-ufps-logo-box">
            <img
              src="/recursos/logo-ufps.png"
              alt="Logo Universidad Francisco de Paula Santander - Programa de Enfermería"
              className="compact-ufps-main-logo"
            />
          </div>
          <div className="compact-brand-texts">
            <span className="compact-brand-title">DAR y RECIBIR</span>
            <span className="compact-brand-sub">
              <strong className="brand-dar-recibir">HUEM</strong>
              <span className="brand-dot">·</span>
              <span className="brand-ufps-text">UFPS Enfermería</span>
            </span>
          </div>
        </button>

        {/* Controles compactos de accesibilidad y audio */}
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
