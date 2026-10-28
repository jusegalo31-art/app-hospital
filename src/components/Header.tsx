import React from 'react';
import { BookOpen, Type, RotateCcw } from 'lucide-react';
import { ScreenStage } from '../types/game';

interface HeaderProps {
  stage: ScreenStage;
  challengeProgressPercent: number;
  largeText: boolean;
  onToggleLargeText: () => void;
  onOpenReference: () => void;
  onRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  challengeProgressPercent,
  largeText,
  onToggleLargeText,
  onOpenReference,
  onRestart,
}) => {
  const getChallengeNumber = (): number => {
    if (stage === 'challenge1') return 1;
    if (stage === 'challenge2') return 2;
    if (stage === 'challenge3') return 3;
    return 0;
  };

  const challengeNum = getChallengeNumber();

  return (
    <header className="app-header" role="banner">
      <div className="header-top-bar">
        {/* Logotipos Oficiales Intactos */}
        <div className="institutional-logos" aria-label="Identidad institucional">
          <img
            src="/recursos/logo-hospital.jpeg"
            alt="Logo oficial E.S.E. Hospital Universitario Erasmo Meoz"
            className="logo-huem"
          />
          <span className="logo-divider" aria-hidden="true" />
          <img
            src="/recursos/logo-ufps.png"
            alt="Logo Universidad Francisco de Paula Santander - Programa de Enfermería"
            className="logo-ufps"
          />
        </div>

        {/* Controles rápidos de accesibilidad y consulta */}
        <div className="header-controls">
          <button
            type="button"
            onClick={onToggleLargeText}
            className={`btn-header-tool ${largeText ? 'btn-header-tool-active' : ''}`}
            aria-pressed={largeText}
            aria-label={
              largeText
                ? 'Desactivar tamaño de letra extra grande'
                : 'Activar tamaño de letra extra grande para lectura fácil'
            }
            title="Cambiar tamaño del texto"
          >
            <Type size={19} aria-hidden="true" />
            <span>{largeText ? 'Letra Normal' : 'Letra Grande'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReference}
            className="btn-header-tool btn-header-guide"
            aria-label="Abrir cartilla de derechos y deberes DAR y RECIBIR"
          >
            <BookOpen size={19} aria-hidden="true" />
            <span>Cartilla</span>
          </button>

          {stage !== 'welcome' && (
            <button
              type="button"
              onClick={onRestart}
              className="btn-header-tool btn-header-restart"
              aria-label="Volver al inicio del juego"
              title="Reiniciar al inicio"
            >
              <RotateCcw size={18} aria-hidden="true" />
              <span className="sr-only-mobile">Inicio</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progreso Visible durante los 3 Retos */}
      {challengeNum > 0 && (
        <div
          className="game-progress-strip"
          role="region"
          aria-label={`Progreso del juego: Reto ${challengeNum} de 3`}
        >
          <div className="progress-meta-row">
            <span className="progress-stage-pill">
              Reto {challengeNum} de 3
            </span>
            <div className="progress-steps-list" aria-hidden="true">
              <span
                className={`step-dot ${
                  challengeNum >= 1 ? 'step-dot-active' : ''
                } ${challengeNum > 1 ? 'step-dot-done' : ''}`}
              >
                1. ¿Dónde va?
              </span>
              <span
                className={`step-dot ${
                  challengeNum >= 2 ? 'step-dot-active' : ''
                } ${challengeNum > 2 ? 'step-dot-done' : ''}`}
              >
                2. Situaciones
              </span>
              <span
                className={`step-dot ${
                  challengeNum >= 3 ? 'step-dot-active' : ''
                }`}
              >
                3. Conecta
              </span>
            </div>
            <span className="progress-percent-label">
              Avance: {Math.round(challengeProgressPercent)}%
            </span>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={Math.round(challengeProgressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de avance general del juego"
          >
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(8, challengeProgressPercent))}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
