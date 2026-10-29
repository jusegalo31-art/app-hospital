/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DariAvatar } from './DariAvatar';
import {
  Volume2,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  FileText,
  Activity,
  Users,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { TabType } from './BottomNavBar';

interface HomeViewProps {
  onNavigate: (tab: TabType) => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  isLargeFont: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSpeak,
  isSpeaking,
  isLargeFont,
}) => {
  const dariGreeting =
    '¡Hola! Soy Dari, tu guía de Trato Digno en el Hospital Erasmo Meoz. Hoy descubriremos juntos tus derechos en salud y los deberes que nos permiten convivir con respeto y calidez.';

  return (
    <div className={`space-y-5 pb-6 ${isLargeFont ? 'text-lg' : 'text-sm'}`}>
      {/* Dari Welcome Banner - Light, clean, empathetic */}
      <section className="bg-gradient-to-br from-teal-50/90 via-emerald-50/40 to-white rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-xs">
        <div className="flex items-start gap-3.5">
          <button
            onClick={() => onSpeak(dariGreeting)}
            className="group focus:outline-hidden"
            title="Toca para escuchar a Dari"
          >
            <DariAvatar size="lg" isSpeaking={isSpeaking} />
            <span className="block text-[10px] text-center text-teal-700 font-medium mt-1 group-hover:underline">
              {isSpeaking ? 'Hablando...' : 'Tócame'}
            </span>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Tu Guía en Salud
              </span>
              <button
                onClick={() => onSpeak(dariGreeting)}
                className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 bg-teal-100/70 hover:bg-teal-200/80 px-2 py-1 rounded-md transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? 'Escuchando' : 'Escuchar'}</span>
              </button>
            </div>

            <h2 className={`font-bold text-slate-900 mt-1 leading-snug ${isLargeFont ? 'text-xl' : 'text-base'}`}>
              “Cumpliendo nuestros deberes garantizamos tus derechos”
            </h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed text-xs sm:text-sm">
              En pocos minutos aprenderás de forma sencilla cómo ejercer tus 7 derechos y cumplir tus 3 deberes en el hospital.
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-4 pt-3 border-t border-teal-100/70 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onNavigate('retos')}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] min-h-[48px]"
          >
            <span>Comenzar Reto Educativo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('cartilla')}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200 flex items-center justify-center gap-2 transition-all min-h-[48px]"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Ver Cartilla</span>
          </button>
        </div>
      </section>

      {/* Overview Cards: DAR y RECIBIR */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estructura DAR y RECIBIR
          </h3>
          <span className="text-xs text-slate-500">10 Principios Clave</span>
        </div>

        {/* 2-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* DAR Card */}
          <div
            onClick={() => onNavigate('cartilla')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                  DAR
                </span>
                <span className="font-bold text-slate-900 text-sm">Mis 3 Deberes</span>
              </div>
              <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                Ver →
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Lo que aportamos para un ambiente seguro y respetuoso:
            </p>

            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>D</strong>ocumentación y puntualidad</span>
              </li>
              <li className="flex items-center gap-2">
                <HeartHandshake className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>A</strong>mabilidad y trato respetuoso</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>R</strong>econocimiento de las normas</span>
              </li>
            </ul>
          </div>

          {/* RECIBIR Card */}
          <div
            onClick={() => onNavigate('cartilla')}
            className="cursor-pointer bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                  REC
                </span>
                <span className="font-bold text-slate-900 text-sm">Mis 7 Derechos</span>
              </div>
              <span className="text-xs font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                Ver →
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Lo que te protege y garantiza una atención humanizada:
            </p>

            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>R</strong>ecibir atención integral y oportuna</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>E</strong>xpresar opiniones e inconformidades</span>
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span><strong>B</strong>eneficio de acompañamiento</span>
              </li>
            </ul>
            <p className="mt-2 text-[11px] text-teal-700 font-medium">
              + Consentimiento, Información, Identificación y Trato Digno
            </p>
          </div>
        </div>
      </section>

      {/* 3 Quick Game Milestones */}
      <section className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Aprende Jugando en 3 Retos
          </h3>
          <span className="text-[11px] text-slate-500">~ 4 minutos</span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">¿Dónde va cada uno?</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Clasifica situaciones reales entre DAR (deberes) y RECIBIR (derechos).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Casos Clínicos Reales</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Aprende qué hacer en Urgencias, Consulta Externa y Triage médico.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Certificado de Trato Digno</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Consolida tu aprendizaje y obtén tu insignia oficial personalizada.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('retos')}
          className="mt-3 w-full py-2.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors text-center block"
        >
          Iniciar Reto 1 ahora →
        </button>
      </section>

      {/* SIAU Direct Help Strip */}
      <section className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-teal-700 uppercase">
            Canales de Atención SIAU
          </span>
          <p className="text-xs text-slate-600 mt-0.5 truncate">
            Asignación de citas, dudas o peticiones respetuosas
          </p>
        </div>
        <button
          onClick={() => onNavigate('siau')}
          className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <span>Canales</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
