/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Smartphone,
  Eye,
  Volume2,
  Palette,
  Sparkles,
} from 'lucide-react';

interface RedesignAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedesignAuditModal: React.FC<RedesignAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostico' | 'solucion' | 'mockups'>('diagnostico');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Evaluación Técnica & Mockups UX
            </span>
            <h3 id="audit-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
              Análisis Completo del Rediseño
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex border-b border-slate-100 px-5 pt-2 bg-slate-50/40 gap-2">
          <button
            onClick={() => setActiveTab('diagnostico')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'diagnostico'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Diagnóstico de Saturación
          </button>
          <button
            onClick={() => setActiveTab('solucion')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'solucion'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Solución Móvil Intuitiva
          </button>
          <button
            onClick={() => setActiveTab('mockups')}
            className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'mockups'
                ? 'border-teal-600 text-teal-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Estructura de Mockups
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'diagnostico' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
                    ¿Por qué la página original se sentía tan saturada?
                  </h4>
                  <p className="text-xs text-amber-900/90 mt-0.5">
                    Al auditar la URL fuente (app-hospital-seven.vercel.app), identificamos 5 factores críticos de fatiga visual y fricción en celular:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs block">
                    ❌ 1. Efecto "Cajas dentro de Cajas" (Borders Inside Borders)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Tarjetas redondeadas con bordes gruesos de color azul y verde metidas dentro de contenedores aún más gruesos. En celulares (390px), esto dejaba apenas un margen estrecho para el texto, provocando una sensación de encierro y saturación.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs block">
                    ❌ 2. Cabecera saturada que robaba el 25% de la pantalla
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Dos logotipos institucionales pegados a la fuerza junto a 3 botones toscos ("Letra Grande", "Cartilla", "Inicio"), empujando el contenido vital muy abajo.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs block">
                    ❌ 3. Avatar de Dari invasivo con exceso de controles
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Un bloque gigantesco con hasta 4 botones de voz simultáneos ("Escuchar", "Detener", "Voz activa", "Voz") y textos redundantes que obligaban al usuario a hacer scroll infinito antes de llegar a la acción principal.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs block">
                    ❌ 4. Contraste chillón y abuso de insignias (Pill Badges)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Textos secundarios envueltos en cápsulas de colores brillantes ("RETO 1 DE 3", "Tarjeta 1 de 6", "DAR 3 Deberes", "RECIBIR 7 Derechos") compitiendo por atención visual.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 text-xs block">
                    ❌ 5. Carencia de navegación táctil para el pulgar (Thumb Zone)
                  </span>
                  <p className="text-xs text-slate-600 mt-1">
                    Sin barra de navegación inferior; el usuario tenía que subir hasta arriba para cambiar de vista o cerrar ventanas emergentes que tapaban toda la pantalla.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solucion' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-950 text-xs sm:text-sm">
                    Principios aplicados en este rediseño moderno
                  </h4>
                  <p className="text-xs text-teal-900/90 mt-0.5">
                    Diseñado específicamente para pacientes, familias y adultos mayores en celulares:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                    <Palette className="w-4 h-4 text-teal-600" />
                    <span>Paleta Hospitalaria Serena (60-30-10)</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Fondo blanco y pizarra suave (60%), superficies claras con bordes sutiles de 1px (30%), y acentos verde azulado institucional HUEM (10%) solo en acciones primarias. Cero chillones.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                    <Smartphone className="w-4 h-4 text-teal-600" />
                    <span>Ergonomía Táctil y Zona del Pulgar</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Barra de navegación fija abajo con hitboxes de 48px, permitiendo usar la aplicación cómodamente con una sola mano en el celular.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                    <Eye className="w-4 h-4 text-teal-600" />
                    <span>Modo "Letra Grande" y Accesibilidad</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Botón accesible en la cabecera para aumentar el tamaño de fuente y mejorar el contraste inmediatamente para personas mayores.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs mb-1">
                    <Volume2 className="w-4 h-4 text-teal-600" />
                    <span>Narrador de Voz Humanizado Unificado</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Dari utiliza la síntesis nativa de voz (Web Speech) sin botones estorbosos: basta con tocar el ícono de audio para escuchar cualquier derecho, deber o reto.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mockups' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                La aplicación ahora está organizada en 5 mockups / vistas funcionales que puedes explorar desde la barra inferior o con los botones de la pantalla:
              </p>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mockup de Inicio (Home Overview)
                    </strong>
                    <span className="text-xs text-slate-600">
                      Bienvenida de Dari, resumen visual de los 3 Deberes (DAR) y 7 Derechos (RECIBIR), y acceso directo con 1 toque al reto interactivo.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mockup de Cartilla Oficial Interactiva
                    </strong>
                    <span className="text-xs text-slate-600">
                      Buscador en tiempo real, filtros segmentados por Deberes y Derechos, ejemplos prácticos de la vida cotidiana y narración con voz.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mockup de Retos y Gamificación
                    </strong>
                    <span className="text-xs text-slate-600">
                      Reto 1 (Clasificador táctil rápido), Reto 2 (Dilemas en Urgencias y Triage), y Reto 3 (Insignia oficial personalizada con tu nombre).
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mockup de Canales SIAU Directos
                    </strong>
                    <span className="text-xs text-slate-600">
                      Botones funcionales con 1 toque para abrir WhatsApp de citas, llamada al conmutador del hospital, Línea Amiga IAMII y guía paso a paso para radicar una PQRSD.
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      Mockup de Asistente Educativo Dari
                    </strong>
                    <span className="text-xs text-slate-600">
                      Consultas frecuentes sobre demoras en urgencias, derechos de acompañamiento, consentimiento médico y trato respetuoso.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Diseñado para E.S.E. Hospital Erasmo Meoz • UFPS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Entendido, volver a la app
          </button>
        </div>
      </div>
    </div>
  );
};
