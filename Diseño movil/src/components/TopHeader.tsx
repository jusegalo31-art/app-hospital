/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Type, HelpCircle, Smartphone, Monitor } from 'lucide-react';

interface TopHeaderProps {
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
  isVoiceMuted: boolean;
  onToggleVoiceMute: () => void;
  onOpenAudit: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  isLargeFont,
  onToggleLargeFont,
  isVoiceMuted,
  onToggleVoiceMute,
  onOpenAudit,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0 tracking-tight">
            HUEM
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight tracking-tight">
              Hospital Erasmo Meoz
            </h1>
            <p className="text-[10px] text-teal-700 font-medium truncate flex items-center gap-1">
              <span>DAR y RECIBIR</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500 font-normal">UFPS Enfermería</span>
            </p>
          </div>
        </div>

        {/* Action affordances */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Audit / Redesign Analysis */}
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
            title="Ver análisis del rediseño antes vs ahora"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
            <span className="hidden xs:inline">Análisis UX</span>
          </button>

          {/* Easy Read / Large Font Mode */}
          <button
            onClick={onToggleLargeFont}
            className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isLargeFont
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={isLargeFont ? 'Volver a tamaño de letra normal' : 'Activar letra grande para lectura fácil'}
            aria-label="Alternar tamaño de letra para accesibilidad"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Voice narrator toggle */}
          <button
            onClick={onToggleVoiceMute}
            className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
              isVoiceMuted
                ? 'text-slate-400 hover:bg-slate-100'
                : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
            }`}
            title={isVoiceMuted ? 'Activar voz de Dari' : 'Silenciar voz de Dari'}
            aria-label={isVoiceMuted ? 'Activar narración de voz' : 'Silenciar narración de voz'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
