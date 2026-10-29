/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DariAvatar } from './DariAvatar';
import { Volume2, ChevronRight, Sparkles, MessageCircle, HeartHandshake } from 'lucide-react';

interface DariGuideViewProps {
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  isLargeFont: boolean;
}

export const DariGuideView: React.FC<DariGuideViewProps> = ({
  onSpeak,
  isSpeaking,
  isLargeFont,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  const guideTopics = [
    {
      title: '¿Por qué en Urgencias atienden a unos antes que a otros?',
      category: 'Atención Oportuna y Triage',
      response:
        'En Urgencias no se atiende por orden de llegada, sino por la gravedad de la persona según el sistema nacional de Triage. Un dolor severo de pecho, asfixia o pérdida del conocimiento siempre tendrán prioridad vital sobre casos que pueden esperar sin riesgo de muerte. Comprender esto salva vidas.',
    },
    {
      title: '¿Tengo derecho a que me expliquen con palabras sencillas?',
      category: 'Información Clara',
      response:
        '¡Totalmente! Es tu derecho fundamental. Si el médico o enfermera usa palabras médicas complejas que no entiendes, puedes decir con tranquilidad: "Doctor, por favor explíqueme en palabras sencillas qué tengo y cómo debo cuidarme". El equipo de salud tiene el deber de hacértelo entender.',
    },
    {
      title: '¿Puedo solicitar una segunda opinión médica antes de operarme?',
      category: 'Consentimiento y 2.ª Opinión',
      response:
        'Sí. Tienes derecho a pedir otro concepto profesional ante diagnósticos de alta complejidad o cirugías mayores, y ningún tratamiento experimental o quirúrgico puede realizarse sin tu consentimiento informado previo firmado.',
    },
    {
      title: '¿Quién puede acompañarme si estoy hospitalizado?',
      category: 'Beneficio de Acompañante',
      response:
        'Los niños, adultos mayores, personas con discapacidad o mujeres en trabajo de parto tienen derecho prioritario a contar con un acompañante permanente según las condiciones de bioseguridad del servicio. Además, tienes derecho a recibir apoyo psicológico o espiritual de tu fe.',
    },
    {
      title: '¿Por qué debo ser puntual y llevar documentos reales?',
      category: 'Deber de Documentación (DAR)',
      response:
        'Presentar tu documento real garantiza que no se confunda tu historia clínica con la de otra persona, protegiendo tus exámenes y prescripciones. La puntualidad permite que el tiempo asignado a tu salud se aproveche al máximo sin retrasar a otros pacientes.',
    },
  ];

  return (
    <div className={`space-y-4 pb-6 ${isLargeFont ? 'text-lg' : 'text-sm'}`}>
      {/* Intro Hero */}
      <div className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-2xl border border-teal-100 flex items-center gap-3.5 shadow-xs">
        <DariAvatar size="lg" isSpeaking={isSpeaking} />
        <div className="min-w-0">
          <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
            Educador Humanizado
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            Conversando con Dari
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Respuestas directas y claras a las situaciones más comunes que vives en el hospital.
          </p>
        </div>
      </div>

      {/* Topics list */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
          Preguntas Frecuentes de Pacientes y Familias
        </h3>

        {guideTopics.map((topic, index) => {
          const isSelected = selectedTopic === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-teal-500 ring-2 ring-teal-100/70 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setSelectedTopic(isSelected ? -1 : index)}
                className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 min-h-[48px]"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-teal-700 block">
                    {topic.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                    {topic.title}
                  </h4>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isSelected ? 'rotate-90 text-teal-600' : ''
                  }`}
                />
              </button>

              {isSelected && (
                <div className="px-3.5 pb-4 pt-1 sm:px-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl space-y-3">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {topic.response}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSpeak(topic.response)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isSpeaking ? 'Escuchando a Dari...' : 'Escuchar respuesta de Dari'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quote */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center space-y-1">
        <HeartHandshake className="w-6 h-6 text-teal-600 mx-auto" />
        <p className="text-xs font-semibold text-slate-800">
          “El trato humanizado se construye entre todos: personal de salud y usuarios.”
        </p>
        <p className="text-[11px] text-slate-500">
          E.S.E. Hospital Universitario Erasmo Meoz
        </p>
      </div>
    </div>
  );
};
