/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SIAU_CHANNELS } from '../data/rightsAndDuties';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  HelpCircle,
  FileText,
  CheckCircle,
} from 'lucide-react';

interface SiauViewProps {
  isLargeFont: boolean;
}

export const SiauView: React.FC<SiauViewProps> = ({ isLargeFont }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'pqrsd' | 'locations'>('direct');

  return (
    <div className={`space-y-4 pb-6 ${isLargeFont ? 'text-lg' : 'text-sm'}`}>
      {/* Title */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Canales de Atención SIAU
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Sistema de Información y Atención al Usuario • Trato Digno al Ciudadano
        </p>
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('direct')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'direct'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Líneas Rápidas
        </button>
        <button
          onClick={() => setActiveTab('pqrsd')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'pqrsd'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ¿Cómo radicar PQRSD?
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors min-h-[38px] ${
            activeTab === 'locations'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Horarios y Sede
        </button>
      </div>

      {/* DIRECT CONTACT LINES */}
      {activeTab === 'direct' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed px-1">
            Toca cualquiera de los canales oficiales para iniciar comunicación inmediata con el hospital:
          </p>

          <div className="space-y-2.5">
            {/* WhatsApp Citas */}
            <a
              href="https://wa.me/573144291269?text=Hola,%20solicito%20información%20sobre%20asignación%20de%20citas%20HUEM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      WhatsApp Asignación de Citas
                    </span>
                    <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                      24/7
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">+57 314 429 1269 • Chatbot automático</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* PBX Conmutador */}
            <a
              href="tel:+576075892850"
              className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    PBX Conmutador Principal
                  </span>
                  <p className="text-xs text-slate-600 truncate">
                    (607) 589 2850 • Ext. 1126 - 1188 (SIAU)
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-teal-700 shrink-0">Llamar</span>
            </a>

            {/* WhatsApp Línea Amiga IAMII */}
            <a
              href="https://wa.me/573153499073?text=Hola,%20comunicación%20con%20Línea%20Amiga%20IAMII"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-pink-500 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    Línea Amiga IAMII (Gestantes y Niños)
                  </span>
                  <p className="text-xs text-slate-600 truncate">
                    315 349 9073 • Lactancia y salud materno infantil
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-pink-600 shrink-0" />
            </a>

            {/* Correo de citas */}
            <a
              href="mailto:asignaciondecitas@herasmomeoz.gov.co"
              className="flex items-center justify-between p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all group shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                    Correo para Citas Médicas
                  </span>
                  <p className="text-xs text-slate-600 truncate">
                    asignaciondecitas@herasmomeoz.gov.co
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 shrink-0">Escribir</span>
            </a>
          </div>
        </div>
      )}

      {/* PQRSD GUIDE */}
      {activeTab === 'pqrsd' && (
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Carta del Trato Digno y Radicación de PQRSD
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tienes el derecho pleno a manifestar tus inquietudes, reclamos o reconocimientos sin ningún tipo de retaliación.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Define el tipo de manifestación</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Petición (solicitud de información), Queja (inconformidad con el servicio), Reclamo (afectación de un derecho), Sugerencia o Felicitación.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Aporta información clara</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Nombre completo, número de documento, teléfono de contacto, fecha de los hechos y servicio donde ocurrió (Urgencias, Consulta, Hospitalización).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Canales habilitados</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Buzón físico en salas de espera, ventanilla del SIAU en la entrada principal o a través de la página web oficial.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://herasmomeoz.gov.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors"
            >
              <span>Ir al Portal Web Oficial HUEM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* LOCATIONS AND HOURS */}
      {activeTab === 'locations' && (
        <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Sede Principal Hospital Erasmo Meoz
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Avenida Guaimaral No. 5AN - 71, Cúcuta, Norte de Santander.
                </p>
                <p className="text-xs text-teal-700 font-medium mt-1">
                  Oficina SIAU: Ubicada directamente en la entrada principal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
              <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Horarios de Atención Presencial SIAU
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  <strong>Lunes a Jueves:</strong> 7:00 a. m. - 12:00 m. y 2:00 p. m. - 6:00 p. m.
                </p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  <strong>Viernes:</strong> 7:00 a. m. - 12:00 m. y 2:00 p. m. - 5:00 p. m.
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  * Urgencias opera las 24 horas todos los días del año.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
