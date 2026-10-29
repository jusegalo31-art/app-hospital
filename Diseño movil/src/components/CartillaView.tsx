/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DUTIES_DATA, RIGHTS_DATA, DutyItem, RightItem } from '../data/rightsAndDuties';
import { filterRightsAndDuties } from '../utils/gameLogic';
import {
  Search,
  Volume2,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Activity,
  MessageSquare,
  ClipboardCheck,
  HelpCircle,
  Users,
  UserCheck,
  Sparkles,
  Check,
  Info,
} from 'lucide-react';

interface CartillaViewProps {
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  currentSpeakingText: string | null;
  isLargeFont: boolean;
}

export const CartillaView: React.FC<CartillaViewProps> = ({
  onSpeak,
  isSpeaking,
  currentSpeakingText,
  isLargeFont,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'duty' | 'right'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>(null);

  const allItems = useMemo(() => [...DUTIES_DATA, ...RIGHTS_DATA], []);

  const filteredItems = useMemo(() => {
    return filterRightsAndDuties(allItems, searchQuery, filterType);
  }, [allItems, searchQuery, filterType]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-4 h-4 text-teal-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-teal-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-teal-700" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-emerald-700" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-emerald-700" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-4 h-4 text-emerald-700" />;
      case 'HelpCircle':
        return <HelpCircle className="w-4 h-4 text-emerald-700" />;
      case 'Users':
        return <Users className="w-4 h-4 text-emerald-700" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-emerald-700" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-700" />;
    }
  };

  const handleAudioPlay = (item: DutyItem | RightItem) => {
    const textToRead = `${item.category === 'duty' ? 'Deber' : 'Derecho'}: ${item.title}. ${item.fullDesc}. En la práctica: ${item.practicalTip}`;
    onSpeak(textToRead);
  };

  return (
    <div className={`space-y-4 pb-6 ${isLargeFont ? 'text-lg' : 'text-sm'}`}>
      {/* Title & Context */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Cartilla Oficial DAR y RECIBIR
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Conoce cada derecho y deber de forma clara, con ejemplos prácticos y audio guía.
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl" role="tablist">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            filterType === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          role="tab"
          aria-selected={filterType === 'all'}
        >
          Todos (10)
        </button>
        <button
          onClick={() => setFilterType('duty')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            filterType === 'duty'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          role="tab"
          aria-selected={filterType === 'duty'}
        >
          DAR: 3 Deberes
        </button>
        <button
          onClick={() => setFilterType('right')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            filterType === 'right'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          role="tab"
          aria-selected={filterType === 'right'}
        >
          RECIBIR: 7 Derechos
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar deber, derecho, cita, norma..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Results Count & Guidance */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Mostrando {filteredItems.length} principios</span>
        <span className="flex items-center gap-1 text-[11px] text-teal-700">
          <Info className="w-3 h-3" />
          Toca cualquier tarjeta para expandir
        </span>
      </div>

      {/* Card Feed */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDuty = item.category === 'duty';
          const isExpanded = activeExpandedId === item.id;
          const isItemSpeaking =
            isSpeaking && currentSpeakingText?.includes(item.title);

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs ${
                isItemSpeaking
                  ? 'border-teal-500 ring-2 ring-teal-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Header clickable zone */}
              <div
                onClick={() =>
                  setActiveExpandedId(isExpanded ? null : item.id)
                }
                className="p-3.5 sm:p-4 cursor-pointer flex items-start gap-3"
              >
                {/* Letter Token */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                    isDuty
                      ? 'bg-teal-50 text-teal-800 border border-teal-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {item.letter}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isDuty ? 'text-teal-700' : 'text-emerald-700'
                      }`}
                    >
                      {isDuty ? 'Deber del Usuario (DAR)' : 'Derecho del Usuario (RECIBIR)'}
                    </span>
                    <span className="text-slate-300 text-xs">·</span>
                    <span className="text-[11px] text-slate-500">
                      {isDuty ? 'Obligación ciudadana' : 'Garantía en salud'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>

                {/* Audio Trigger Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAudioPlay(item);
                  }}
                  className={`p-2 rounded-lg transition-colors shrink-0 min-w-[38px] min-h-[38px] flex items-center justify-center ${
                    isItemSpeaking
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-400 hover:text-teal-700 hover:bg-teal-50'
                  }`}
                  title="Escuchar este principio en voz alta"
                  aria-label={`Escuchar ${item.title}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-3.5 pb-4 pt-1 sm:px-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl space-y-3">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Definición Oficial
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-800 mt-1 leading-relaxed">
                      {item.fullDesc}
                    </p>
                  </div>

                  {/* Practical tip */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                      {getIcon(item.iconName)}
                      <span>¿Cómo se aplica en la práctica?</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {item.practicalTip}
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleAudioPlay(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isItemSpeaking ? 'Detener o repetir' : 'Escuchar explicación'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveExpandedId(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cerrar detalle
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6">
            <p className="text-sm font-semibold text-slate-700">
              No se encontraron resultados para "{searchQuery}"
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Prueba buscando por palabras como "citas", "nombre", "acompañante" o "respeto".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100"
            >
              Restablecer búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
