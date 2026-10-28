import React from 'react';
import { DariPose } from '../types/game';

interface DariAvatarProps {
  pose?: DariPose;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Personaje Guía Original: "Dari" — Orientador Ciudadano DAR Y RECIBIR
 * Diseño vectorial expresivo con 6 estados emocionales, parpadeo suave,
 * microanimaciones de cabeza/manos e indicador de habla sincronizado.
 * Claramente diferenciado del personal médico clínico y de los logotipos oficiales.
 */
export const DariAvatar: React.FC<DariAvatarProps> = ({
  pose = 'welcome',
  isSpeaking = false,
  size = 'md',
  className = '',
}) => {
  const sizeClass =
    size === 'lg'
      ? 'dari-avatar-lg'
      : size === 'sm'
      ? 'dari-avatar-sm'
      : 'dari-avatar-md';

  const getPoseLabel = (p: DariPose): string => {
    switch (p) {
      case 'welcome':
        return 'Dari saludando amablemente';
      case 'explaining':
        return 'Dari explicando el reto paso a paso';
      case 'listening':
        return 'Dari atento a tu respuesta';
      case 'happy':
        return 'Dari alegre por tu acierto';
      case 'encouraging':
        return 'Dari animándote con paciencia';
      case 'celebrating':
        return 'Dari celebrando tu logro';
    }
  };

  return (
    <div
      className={`dari-avatar-wrapper ${sizeClass} pose-${pose} ${
        isSpeaking ? 'dari-is-speaking' : ''
      } ${className}`}
      role="img"
      aria-label={getPoseLabel(pose)}
    >
      <svg
        viewBox="0 0 120 120"
        className="dari-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dariBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8f6fd" />
            <stop offset="65%" stopColor="#d9f4ee" />
            <stop offset="100%" stopColor="#b7edeb" />
          </linearGradient>
          <linearGradient id="dariVestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f75ce" />
            <stop offset="100%" stopColor="#143d73" />
          </linearGradient>
          <clipPath id="dariCircleClip">
            <circle cx="60" cy="60" r="54" />
          </clipPath>
        </defs>

        {/* Halo exterior con pulso discreto cuando habla */}
        <circle
          cx="60"
          cy="60"
          r="57"
          className="dari-outer-ring"
          fill="none"
          stroke={
            pose === 'happy' || pose === 'celebrating'
              ? '#008238'
              : pose === 'encouraging'
              ? '#2098d9'
              : '#1f75ce'
          }
          strokeWidth="3"
        />

        {/* Fondo circular luminoso */}
        <circle cx="60" cy="60" r="54" fill="url(#dariBgGrad)" />

        {/* Destellos de celebración en estados alegres */}
        {(pose === 'celebrating' || pose === 'happy') && (
          <g className="dari-sparkles">
            <circle cx="20" cy="28" r="3.5" fill="#008238" />
            <circle cx="100" cy="26" r="3.5" fill="#1f75ce" />
            <circle cx="16" cy="56" r="2.5" fill="#2098d9" />
            <circle cx="103" cy="54" r="2.5" fill="#008238" />
          </g>
        )}

        <g clipPath="url(#dariCircleClip)">
          {/* Torso: Camisa blanca ciudadana y chaleco institucional de orientador */}
          <g className="dari-torso-group">
            {/* Hombros y chaleco azul institucional */}
            <path
              d="M22 118 C24 84, 96 84, 98 118 Z"
              fill="url(#dariVestGrad)"
            />
            {/* Apertura en V de camisa blanca y corbata/pañuelo verde institucional */}
            <polygon points="46,84 60,114 74,84" fill="#ffffff" />
            <polygon points="56,88 64,88 62,112 58,112" fill="#008238" />

            {/* Solapa verde institucional en el chaleco */}
            <path
              d="M44 85 L58 112 L52 114 L39 87 Z"
              fill="#008238"
            />
            <path
              d="M76 85 L62 112 L68 114 L81 87 Z"
              fill="#008238"
            />

            {/* Escarapela de Orientador Ciudadano "DARI" */}
            <g transform="translate(71, 95)">
              <rect
                x="0"
                y="0"
                width="20"
                height="12"
                rx="3"
                fill="#ffffff"
                stroke="#143d73"
                strokeWidth="1.5"
              />
              <rect x="2" y="2" width="16" height="3.5" rx="1" fill="#008238" />
              <line
                x1="3"
                y1="8.5"
                x2="15"
                y2="8.5"
                stroke="#1f75ce"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>

            {/* Cuello */}
            <rect x="52" y="72" width="16" height="16" rx="6" fill="#efb995" />
          </g>

          {/* Cabeza con microanimación suave */}
          <g className="dari-head-group">
            {/* Orejas */}
            <circle cx="33" cy="52" r="6" fill="#eab08a" />
            <circle cx="87" cy="52" r="6" fill="#eab08a" />

            {/* Rostro cálido y amable */}
            <rect
              x="35"
              y="24"
              width="50"
              height="52"
              rx="24"
              fill="#f4c29f"
            />

            {/* Mejillas suaves */}
            <ellipse
              cx="43"
              cy="57"
              rx="4.5"
              ry="2.5"
              fill="#ec8f7a"
              opacity="0.45"
            />
            <ellipse
              cx="77"
              cy="57"
              rx="4.5"
              ry="2.5"
              fill="#ec8f7a"
              opacity="0.45"
            />

            {/* Cabello castaño oscuro moderno y prolijo */}
            <path
              d="M33 44 C31 20, 89 20, 87 44 C85 31, 75 26, 58 27 C45 27, 36 33, 33 44 Z"
              fill="#1b2a3b"
            />
            <path
              d="M36 33 Q52 22 76 30"
              fill="none"
              stroke="#2c445e"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cejas expresivas según el estado */}
            {pose === 'encouraging' ? (
              <>
                <path
                  d="M42 43 Q48 40 53 43"
                  fill="none"
                  stroke="#1b2a3b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M67 43 Q72 40 78 43"
                  fill="none"
                  stroke="#1b2a3b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <path
                  d="M42 42 Q48 38 54 41"
                  fill="none"
                  stroke="#1b2a3b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M66 41 Q72 38 78 42"
                  fill="none"
                  stroke="#1b2a3b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </>
            )}

            {/* Gafas ligeras de orientador (transmiten cercanía, sabiduría y confianza) */}
            <g stroke="#143d73" strokeWidth="2" fill="none">
              <rect x="40" y="44" width="16" height="11" rx="4" fill="#ffffff" fillOpacity="0.25" />
              <rect x="64" y="44" width="16" height="11" rx="4" fill="#ffffff" fillOpacity="0.25" />
              <line x1="56" y1="49" x2="64" y2="49" />
            </g>

            {/* Ojos con parpadeo suave */}
            <g className="dari-eyes">
              {pose === 'happy' || pose === 'celebrating' ? (
                <>
                  <path
                    d="M44 50 Q48 46 52 50"
                    fill="none"
                    stroke="#0f2537"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M68 50 Q72 46 76 50"
                    fill="none"
                    stroke="#0f2537"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                <>
                  <circle cx="48" cy="49.5" r="2.8" fill="#0f2537" />
                  <circle cx="72" cy="49.5" r="2.8" fill="#0f2537" />
                  <circle cx="49" cy="48.5" r="0.9" fill="#ffffff" />
                  <circle cx="73" cy="48.5" r="0.9" fill="#ffffff" />
                </>
              )}
            </g>

            {/* Nariz suave */}
            <path
              d="M60 51 L58 57 L61.5 57.5"
              fill="none"
              stroke="#c98b67"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Boca sincronizada con habla y estado emocional */}
            <g className="dari-mouth-group">
              {isSpeaking ? (
                <ellipse
                  cx="60"
                  cy="65"
                  rx="6.5"
                  ry="4.2"
                  fill="#9e2a2b"
                  className="dari-mouth-speaking"
                />
              ) : pose === 'happy' || pose === 'celebrating' ? (
                <path
                  d="M50 62 Q60 72 70 62 Z"
                  fill="#ffffff"
                  stroke="#0f2537"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              ) : pose === 'encouraging' ? (
                <path
                  d="M53 64 Q60 68 67 64"
                  fill="none"
                  stroke="#0f2537"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M51 62 Q60 70 69 62"
                  fill="none"
                  stroke="#0f2537"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              )}
            </g>
          </g>

          {/* Gesto de Mano según Estado (Saludo, Explicación o Celebración) */}
          {(pose === 'welcome' || pose === 'celebrating') && (
            <g className="dari-hand-wave" transform="translate(88, 66)">
              <path
                d="M4 26 L8 10 C9 6, 15 6, 15 11 L14 28 Z"
                fill="#1f75ce"
              />
              <circle cx="11" cy="8" r="7.5" fill="#f4c29f" stroke="#d59b78" strokeWidth="1.2" />
            </g>
          )}

          {pose === 'explaining' && (
            <g className="dari-hand-explain" transform="translate(14, 72)">
              <circle cx="12" cy="12" r="7" fill="#f4c29f" stroke="#d59b78" strokeWidth="1.2" />
            </g>
          )}
        </g>
      </svg>

      {/* Indicador visual discreto de voz activa */}
      {isSpeaking && (
        <span
          className="dari-speaking-badge"
          aria-hidden="true"
          title="Dari está hablando"
        >
          <span className="dari-wave-bar bar-1" />
          <span className="dari-wave-bar bar-2" />
          <span className="dari-wave-bar bar-3" />
        </span>
      )}
    </div>
  );
};
