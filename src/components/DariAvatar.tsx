import React from 'react';
import { DariPose } from '../types/game';

interface DariAvatarProps {
  pose?: DariPose;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Avatar circular de "Dari", Orientador en Salud del E.S.E. Hospital Universitario Erasmo Meoz.
 * Diseño móvil limpio e intuitivo conservando los colores institucionales originales (Azul y Verde HUEM)
 * y las expresiones emocionales según el estado del juego.
 */
export const DariAvatar: React.FC<DariAvatarProps> = ({
  pose = 'welcome',
  isSpeaking = false,
  size = 'md',
  className = '',
}) => {
  const renderEyes = () => {
    if (pose === 'happy' || pose === 'celebrating') {
      return (
        <g>
          <path
            d="M36.5 40.5C37.8 38.2 42.2 38.2 43.5 40.5"
            stroke="#0F2537"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M56.5 40.5C57.8 38.2 62.2 38.2 63.5 40.5"
            stroke="#0F2537"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      );
    }

    return (
      <g className="dari-eyes-blink">
        <circle cx="40" cy="40.5" r="2.6" fill="#0F2537" />
        <circle cx="41.1" cy="39.5" r="0.95" fill="#FFFFFF" />
        <circle cx="60" cy="40.5" r="2.6" fill="#0F2537" />
        <circle cx="61.1" cy="39.5" r="0.95" fill="#FFFFFF" />
      </g>
    );
  };

  const renderMouth = () => {
    if (isSpeaking) {
      return (
        <ellipse
          cx="50"
          cy="52.5"
          rx="4.6"
          ry="3.4"
          fill="#991B1B"
          className="dari-mouth-talk"
        />
      );
    }

    if (pose === 'celebrating' || pose === 'happy') {
      return (
        <path
          d="M43 50C45.5 55.5 54.5 55.5 57 50Z"
          fill="#991B1B"
          stroke="#991B1B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      );
    }

    if (pose === 'encouraging') {
      return (
        <path
          d="M45 52C47.5 54.5 52.5 54.5 55 52"
          stroke="#991B1B"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      );
    }

    return (
      <path
        d="M44 51C46 55 54 55 56 51"
        stroke="#991B1B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div
      className={`dari-circle-avatar dari-avatar-wrapper pose-${pose} dari-circle-${size} ${
        isSpeaking ? 'dari-circle-speaking' : ''
      } ${className}`}
      data-pose={pose}
    >
      {isSpeaking && <span className="dari-pulse-ring" aria-hidden="true" />}

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="dari-circle-svg"
        role="img"
        aria-label="Dari, tu guía en derechos y deberes"
      >
        {/* Fondo suave con colores institucionales */}
        <circle cx="50" cy="50" r="48" fill="#EBF5FF" />

        {/* Chaqueta institucional azul HUEM (#1F75CE / #143D73) */}
        <path
          d="M20 90C20 74 34 68 50 68C66 68 80 74 80 90V96H20V90Z"
          fill="#143D73"
        />
        {/* Solapa interna verde institucional HUEM (#008238) */}
        <path d="M42 68L50 81L58 68H42Z" fill="#FFFFFF" />
        <path d="M47 72L50 81L53 72H47Z" fill="#008238" />

        {/* Carné institucional HUEM */}
        <rect x="58" y="74" width="12" height="15" rx="2" fill="#F8FAFC" />
        <rect x="60.5" y="76.5" width="7" height="4" rx="1" fill="#008238" />
        <line
          x1="64"
          y1="68"
          x2="64"
          y2="74"
          stroke="#93C5FD"
          strokeWidth="1.6"
        />

        {/* Cordón de orientación */}
        <path
          d="M34 68C34 82 40 85 46 85"
          stroke="#2098D9"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="47" cy="85" r="3.2" fill="#E2E8F0" />

        {/* Cuello y rostro cálido */}
        <rect
          x="44"
          y="58"
          width="12"
          height="13"
          rx="3"
          fill="#F5CBA7"
        />
        <ellipse cx="50" cy="42" rx="22" ry="24" fill="#FAD7B8" />

        {/* Cabello profesional */}
        <path
          d="M28 38C28 24 38 18 50 18C62 18 72 24 72 38C72 33 66 26 50 26C34 26 28 33 28 38Z"
          fill="#1E3A5F"
        />
        <path
          d="M27 38C27 44 29 49 31 51C31 42 34 32 40 28C32 30 27 34 27 38Z"
          fill="#1E3A5F"
        />

        {/* Gafas institucionales azul HUEM */}
        <rect
          x="33"
          y="35"
          width="14"
          height="11"
          rx="3.5"
          stroke="#143D73"
          strokeWidth="2.4"
          fill="#FFFFFF"
          fillOpacity="0.72"
        />
        <rect
          x="53"
          y="35"
          width="14"
          height="11"
          rx="3.5"
          stroke="#143D73"
          strokeWidth="2.4"
          fill="#FFFFFF"
          fillOpacity="0.72"
        />
        <line
          x1="47"
          y1="40"
          x2="53"
          y2="40"
          stroke="#143D73"
          strokeWidth="2.4"
        />

        {/* Ojos y cejas */}
        {renderEyes()}
        <path
          d="M34 32C36 30 43 31 45 33"
          stroke="#1E3A5F"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M55 33C57 31 64 30 66 32"
          stroke="#1E3A5F"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Boca expresiva */}
        {renderMouth()}

        {/* Mejillas cálidas */}
        <ellipse cx="33" cy="47" rx="3" ry="2" fill="#F87171" opacity="0.38" />
        <ellipse cx="67" cy="47" rx="3" ry="2" fill="#F87171" opacity="0.38" />
      </svg>

      <span
        className={`dari-status-dot ${isSpeaking ? 'dot-speaking' : ''}`}
        title={isSpeaking ? 'Dari está hablando' : 'Dari listo para ayudarte'}
      />
    </div>
  );
};
