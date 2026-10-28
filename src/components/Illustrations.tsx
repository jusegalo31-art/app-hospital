import React from 'react';
import { DariAvatar } from './DariAvatar';
import { DariPose } from '../types/game';

/**
 * Ilustración principal de Bienvenida:
 * Escena amable de atención humanizada en salud con profesional de enfermería/medicina
 * y usuarios en un entorno luminoso con los colores institucionales.
 */
export const WelcomeHeroIllustration: React.FC = () => (
  <svg
    viewBox="0 0 420 220"
    className="hero-svg"
    role="img"
    aria-label="Ilustración amable de personal de salud y usuarios compartiendo un trato respetuoso y humanizado"
  >
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e8f6fc" />
        <stop offset="60%" stopColor="#d6f5ef" />
        <stop offset="100%" stopColor="#b7edeb" />
      </linearGradient>
      <linearGradient id="darBadge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#143d73" />
        <stop offset="100%" stopColor="#1f75ce" />
      </linearGradient>
      <linearGradient id="recibirBadge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#008a3c" />
        <stop offset="100%" stopColor="#15b35a" />
      </linearGradient>
    </defs>

    {/* Fondo suave redondeado */}
    <rect x="6" y="6" width="408" height="208" rx="24" fill="url(#bgGrad)" />

    {/* Elementos decorativos de fondo (edificio hospitalario estilizado) */}
    <circle cx="65" cy="52" r="28" fill="#ffffff" opacity="0.65" />
    <circle cx="355" cy="48" r="34" fill="#ffffff" opacity="0.55" />
    <rect x="155" y="22" width="110" height="72" rx="12" fill="#ffffff" opacity="0.88" />
    <rect x="203" y="30" width="14" height="32" rx="3" fill="#008a3c" />
    <rect x="194" y="39" width="32" height="14" rx="3" fill="#008a3c" />
    <rect x="172" y="68" width="20" height="16" rx="3" fill="#68c4e1" opacity="0.5" />
    <rect x="200" y="68" width="20" height="16" rx="3" fill="#68c4e1" opacity="0.5" />
    <rect x="228" y="68" width="20" height="16" rx="3" fill="#68c4e1" opacity="0.5" />

    {/* Insignia izquierda: DAR (Deberes) */}
    <g transform="translate(26, 32)">
      <rect x="0" y="0" width="96" height="44" rx="12" fill="url(#darBadge)" />
      <text
        x="48"
        y="21"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontWeight="800"
        fontFamily="Nunito, sans-serif"
      >
        DAR
      </text>
      <text
        x="48"
        y="36"
        textAnchor="middle"
        fill="#b7edeb"
        fontSize="10"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        3 Deberes
      </text>
    </g>

    {/* Insignia derecha: RECIBIR (Derechos) */}
    <g transform="translate(298, 32)">
      <rect x="0" y="0" width="96" height="44" rx="12" fill="url(#recibirBadge)" />
      <text
        x="48"
        y="21"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontWeight="800"
        fontFamily="Nunito, sans-serif"
      >
        RECIBIR
      </text>
      <text
        x="48"
        y="36"
        textAnchor="middle"
        fill="#e6fffa"
        fontSize="10"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        7 Derechos
      </text>
    </g>

    {/* Profesional de salud (Izquierda-Centro) */}
    <g transform="translate(95, 76)">
      {/* Cuerpo bata blanca y uniforme azul */}
      <path
        d="M20 68 C20 48, 70 48, 70 68 L76 132 L14 132 Z"
        fill="#1f75ce"
      />
      <path
        d="M16 70 C16 52, 34 50, 38 72 L36 132 L12 132 Z"
        fill="#ffffff"
      />
      <path
        d="M74 70 C74 52, 56 50, 52 72 L54 132 L78 132 Z"
        fill="#ffffff"
      />
      {/* Estetoscopio */}
      <path
        d="M32 56 C32 76, 58 76, 58 56"
        fill="none"
        stroke="#0f2537"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="58" cy="76" r="5" fill="#2098d9" stroke="#0f2537" strokeWidth="2" />
      {/* Cabeza */}
      <circle cx="45" cy="30" r="20" fill="#f6c7a8" />
      {/* Cabello */}
      <path
        d="M25 28 C25 10, 65 10, 65 28 C65 18, 55 14, 45 14 C35 14, 25 18, 25 28 Z"
        fill="#1e293b"
      />
      {/* Sonrisa amable y ojos */}
      <circle cx="38" cy="28" r="2.3" fill="#0f2537" />
      <circle cx="52" cy="28" r="2.3" fill="#0f2537" />
      <path
        d="M38 36 Q45 42 52 36"
        fill="none"
        stroke="#0f2537"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Escarapela de identificación */}
      <rect x="55" y="84" width="14" height="10" rx="2" fill="#008a3c" />
    </g>

    {/* Corazón central de Trato Digno y Humanizado */}
    <g transform="translate(192, 108)">
      <circle cx="18" cy="18" r="22" fill="#ffffff" stroke="#68c4e1" strokeWidth="2.5" />
      <path
        d="M18 28 C18 28, 7 20, 7 13 C7 9, 10 7, 13.5 7 C15.8 7, 17.3 8.3, 18 10 C18.7 8.3, 20.2 7, 22.5 7 C26 7, 29 9, 29 13 C29 20, 18 28, 18 28 Z"
        fill="#008a3c"
      />
    </g>

    {/* Usuario / Paciente Mayor Amable (Derecha-Centro) */}
    <g transform="translate(238, 78)">
      {/* Ropa verde/turquesa acogedora */}
      <path
        d="M20 68 C20 48, 72 48, 72 68 L78 130 L14 130 Z"
        fill="#008a3c"
      />
      {/* Cuello camisa blanca */}
      <path d="M36 52 L46 66 L56 52 Z" fill="#ffffff" />
      {/* Cabeza */}
      <circle cx="46" cy="30" r="20" fill="#eab696" />
      {/* Cabello canoso respetuoso (adulto mayor activo) */}
      <path
        d="M26 26 C26 10, 66 10, 66 26 C62 16, 30 16, 26 26 Z"
        fill="#cbd5e1"
      />
      {/* Gafas */}
      <rect
        x="32"
        y="23"
        width="11"
        height="8"
        rx="3"
        fill="none"
        stroke="#143d73"
        strokeWidth="2"
      />
      <rect
        x="49"
        y="23"
        width="11"
        height="8"
        rx="3"
        fill="none"
        stroke="#143d73"
        strokeWidth="2"
      />
      <line x1="43" y1="27" x2="49" y2="27" stroke="#143d73" strokeWidth="2" />
      {/* Sonrisa */}
      <path
        d="M39 37 Q46 43 53 37"
        fill="none"
        stroke="#0f2537"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Carnet / Documento en mano */}
      <rect
        x="18"
        y="82"
        width="22"
        height="15"
        rx="3"
        fill="#ffffff"
        stroke="#143d73"
        strokeWidth="2"
      />
      <line x1="22" y1="87" x2="35" y2="87" stroke="#1f75ce" strokeWidth="2" />
      <line x1="22" y1="92" x2="31" y2="92" stroke="#008a3c" strokeWidth="2" />
    </g>
  </svg>
);

/**
 * Personaje auxiliar orientador "Dari" (Claramente diferenciado de los símbolos oficiales):
 * Reutiliza el componente DariAvatar con sus estados visuales y microanimaciones.
 */
export const GuideCharacterAvatar: React.FC<{
  mood?: 'happy' | 'thinking' | 'celebrate';
  pose?: DariPose;
  isSpeaking?: boolean;
}> = ({ mood = 'happy', pose, isSpeaking = false }) => {
  const mappedPose: DariPose =
    pose ||
    (mood === 'celebrate'
      ? 'celebrating'
      : mood === 'thinking'
      ? 'encouraging'
      : 'happy');

  return <DariAvatar pose={mappedPose} isSpeaking={isSpeaking} size="sm" />;
};

/**
 * Ilustraciones para las escenas cotidianas del Reto 2
 */
export const ScenarioIllustration: React.FC<{
  type:
    | 'medical-info'
    | 'punctual-arrival'
    | 'express-opinion'
    | 'informed-consent'
    | 'respectful-name'
    | 'companion-support';
}> = ({ type }) => {
  switch (type) {
    case 'medical-info':
      return (
        <svg viewBox="0 0 280 120" className="scenario-svg" aria-hidden="true">
          <rect x="4" y="4" width="272" height="112" rx="16" fill="#ebf8ff" />
          <circle cx="72" cy="60" r="34" fill="#ffffff" stroke="#2098d9" strokeWidth="2.5" />
          {/* Icono diálogo médico claro y escudo confidencial */}
          <rect x="52" y="42" width="40" height="28" rx="6" fill="#1f75ce" />
          <path d="M62 70 L58 80 L70 70 Z" fill="#1f75ce" />
          <line x1="60" y1="52" x2="84" y2="52" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="60" x2="76" y2="60" stroke="#b7edeb" strokeWidth="3" strokeLinecap="round" />

          <g transform="translate(145, 24)">
            <rect x="0" y="0" width="96" height="72" rx="12" fill="#ffffff" stroke="#008a3c" strokeWidth="2.5" />
            <path d="M48 14 L68 22 V38 C68 51 59 60 48 64 C37 60 28 51 28 38 V22 L48 14 Z" fill="#e6fffa" stroke="#008a3c" strokeWidth="2.5" />
            <path d="M41 39 L46 44 L56 33" fill="none" stroke="#008a3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      );

    case 'punctual-arrival':
      return (
        <svg viewBox="0 0 280 120" className="scenario-svg" aria-hidden="true">
          <rect x="4" y="4" width="272" height="112" rx="16" fill="#eef6ff" />
          {/* Documento de identidad real */}
          <rect x="36" y="28" width="102" height="64" rx="10" fill="#ffffff" stroke="#143d73" strokeWidth="2.5" />
          <rect x="48" y="42" width="24" height="28" rx="4" fill="#68c4e1" />
          <circle cx="60" cy="52" r="6" fill="#143d73" />
          <line x1="82" y1="46" x2="124" y2="46" stroke="#1f75ce" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="82" y1="58" x2="116" y2="58" stroke="#008a3c" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="82" y1="70" x2="106" y2="70" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {/* Reloj puntualidad */}
          <circle cx="204" cy="60" r="34" fill="#ffffff" stroke="#008a3c" strokeWidth="3" />
          <circle cx="204" cy="60" r="3" fill="#143d73" />
          <line x1="204" y1="60" x2="204" y2="40" stroke="#143d73" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="204" y1="60" x2="220" y2="60" stroke="#008a3c" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'express-opinion':
      return (
        <svg viewBox="0 0 280 120" className="scenario-svg" aria-hidden="true">
          <rect x="4" y="4" width="272" height="112" rx="16" fill="#e6fffa" />
          {/* Buzón SIAU / Opiniones */}
          <rect x="46" y="26" width="84" height="70" rx="10" fill="#ffffff" stroke="#008a3c" strokeWidth="2.5" />
          <rect x="64" y="38" width="48" height="7" rx="3.5" fill="#143d73" />
          <rect x="72" y="20" width="32" height="22" rx="3" fill="#68c4e1" stroke="#143d73" strokeWidth="2" />
          <text x="88" y="74" textAnchor="middle" fill="#008a3c" fontSize="13" fontWeight="800">
            SIAU
          </text>
          {/* Burbujas de diálogo respetuoso */}
          <rect x="154" y="30" width="84" height="46" rx="12" fill="#1f75ce" />
          <path d="M170 76 L162 88 L182 76 Z" fill="#1f75ce" />
          <line x1="170" y1="47" x2="222" y2="47" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="170" y1="59" x2="206" y2="59" stroke="#b7edeb" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'informed-consent':
      return (
        <svg viewBox="0 0 280 120" className="scenario-svg" aria-hidden="true">
          <rect x="4" y="4" width="272" height="112" rx="16" fill="#ebf8ff" />
          {/* Documento de consentimiento informado */}
          <rect x="56" y="18" width="74" height="84" rx="8" fill="#ffffff" stroke="#143d73" strokeWidth="2.5" />
          <line x1="70" y1="36" x2="116" y2="36" stroke="#1f75ce" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="48" x2="116" y2="48" stroke="#68c4e1" strokeWidth="3" strokeLinecap="round" />
          <line x1="70" y1="60" x2="102" y2="60" stroke="#68c4e1" strokeWidth="3" strokeLinecap="round" />
          <path d="M72 82 Q84 74 94 82 T114 78" fill="none" stroke="#008a3c" strokeWidth="3" strokeLinecap="round" />
          {/* Segunda opinión médica */}
          <circle cx="196" cy="60" r="34" fill="#ffffff" stroke="#008a3c" strokeWidth="2.5" />
          <text x="196" y="56" textAnchor="middle" fill="#143d73" fontSize="14" fontWeight="800">
            2.ª
          </text>
          <text x="196" y="74" textAnchor="middle" fill="#008a3c" fontSize="11" fontWeight="700">
            Opinión
          </text>
        </svg>
      );

    case 'respectful-name':
    default:
      return (
        <svg viewBox="0 0 280 120" className="scenario-svg" aria-hidden="true">
          <rect x="4" y="4" width="272" height="112" rx="16" fill="#e6fffa" />
          {/* Credencial con nombre */}
          <rect x="42" y="28" width="196" height="64" rx="14" fill="#ffffff" stroke="#1f75ce" strokeWidth="2.5" />
          <circle cx="80" cy="60" r="20" fill="#b7edeb" />
          <circle cx="80" cy="54" r="7" fill="#143d73" />
          <path d="M66 72 C68 62, 92 62, 94 72" fill="#143d73" />
          <text x="112" y="53" fill="#008a3c" fontSize="12" fontWeight="800">
            TRATO DIGNO Y HUMANO
          </text>
          <text x="112" y="72" fill="#143d73" fontSize="13" fontWeight="700">
            ¡Por mi propio nombre!
          </text>
        </svg>
      );
  }
};
