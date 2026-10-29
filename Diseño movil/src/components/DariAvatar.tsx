/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DariAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  className?: string;
}

export const DariAvatar: React.FC<DariAvatarProps> = ({
  size = 'md',
  isSpeaking = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {/* Speaking wave halo effect */}
      {isSpeaking && (
        <span
          className="absolute inset-0 rounded-full bg-teal-400/30 animate-ping opacity-75"
          style={{ animationDuration: '2s' }}
        />
      )}

      {/* Modern Friendly Dari Vector */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full shadow-sm bg-gradient-to-b from-teal-50 to-teal-100/60 p-0.5 border border-teal-200"
        aria-label="Dari, tu guía en derechos y deberes"
      >
        {/* Soft background glow */}
        <circle cx="50" cy="50" r="48" fill="#F0FDFA" />

        {/* Shoulders / Teal Healthcare Scrub */}
        <path
          d="M20 90C20 74 34 68 50 68C66 68 80 74 80 90V96H20V90Z"
          fill="#0D9488"
        />
        {/* Scrub V-Neck & ID card */}
        <path d="M42 68L50 80L58 68H42Z" fill="#F8FAFC" />
        <rect x="58" y="74" width="12" height="15" rx="2" fill="#E2E8F0" />
        <rect x="61" y="77" width="6" height="4" rx="1" fill="#0D9488" />
        <line x1="64" y1="68" x2="64" y2="74" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Stethoscope around neck */}
        <path
          d="M34 68C34 82 40 85 46 85"
          stroke="#334155"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="47" cy="85" r="3.5" fill="#64748B" />

        {/* Neck */}
        <rect x="44" y="58" width="12" height="13" rx="3" fill="#FCD34D" opacity="0.9" />

        {/* Head / Face */}
        <ellipse cx="50" cy="42" rx="22" ry="24" fill="#FDE68A" />

        {/* Neat Healthcare Haircut */}
        <path
          d="M28 38C28 24 38 18 50 18C62 18 72 24 72 38C72 33 66 26 50 26C34 26 28 33 28 38Z"
          fill="#475569"
        />
        <path
          d="M27 38C27 44 29 49 31 51C31 42 34 32 40 28C32 30 27 34 27 38Z"
          fill="#475569"
        />

        {/* Modern Clean Glasses */}
        <rect
          x="33"
          y="35"
          width="14"
          height="11"
          rx="3.5"
          stroke="#0F766E"
          strokeWidth="2.5"
          fill="#FFFFFF"
          fillOpacity="0.7"
        />
        <rect
          x="53"
          y="35"
          width="14"
          height="11"
          rx="3.5"
          stroke="#0F766E"
          strokeWidth="2.5"
          fill="#FFFFFF"
          fillOpacity="0.7"
        />
        <line x1="47" y1="40" x2="53" y2="40" stroke="#0F766E" strokeWidth="2.5" />

        {/* Friendly Eyes */}
        <circle cx="40" cy="40.5" r="2.5" fill="#1E293B" />
        <circle cx="41.2" cy="39.5" r="0.9" fill="#FFFFFF" />
        <circle cx="60" cy="40.5" r="2.5" fill="#1E293B" />
        <circle cx="61.2" cy="39.5" r="0.9" fill="#FFFFFF" />

        {/* Friendly Eyebrows */}
        <path
          d="M34 32C36 30 43 31 45 33"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M55 33C57 31 64 30 66 32"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Cheerful Smile */}
        {isSpeaking ? (
          <ellipse cx="50" cy="53" rx="4.5" ry="3.5" fill="#BE123C" />
        ) : (
          <path
            d="M44 51C46 55 54 55 56 51"
            stroke="#991B1B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="33" cy="47" rx="3" ry="2" fill="#F87171" opacity="0.4" />
        <ellipse cx="67" cy="47" rx="3" ry="2" fill="#F87171" opacity="0.4" />
      </svg>

      {/* Online / Active Indicator */}
      <span
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
          isSpeaking ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-teal-500'
        }`}
        title={isSpeaking ? 'Dari está hablando' : 'Dari listo para ayudarte'}
      />
    </div>
  );
};
