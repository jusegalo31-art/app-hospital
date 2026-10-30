import React, { useState } from 'react';
import {
  ChevronRight,
  Volume2,
  Square,
  HeartHandshake,
} from 'lucide-react';
import { SpeechHook } from '../hooks/useSpeech';
import { getColombianAudioPath } from '../data/dariDialogues';
import { DariAvatar } from './DariAvatar';

interface DariViewProps {
  speech: SpeechHook;
}

const DARI_FAQ_ITEMS = [
  {
    id: 'faq_0',
    category: 'Atención Oportuna y Triage',
    title: '¿Por qué en Urgencias atienden a unos antes que a otros?',
    response:
      'En Urgencias no se atiende por orden de llegada, sino por la gravedad de la persona según el sistema nacional de Triage. Un dolor severo de pecho, asfixia o pérdida del conocimiento siempre tendrán prioridad vital sobre casos que pueden esperar sin riesgo de muerte. Comprender esto salva vidas.',
  },
  {
    id: 'faq_1',
    category: 'Información Clara',
    title: '¿Tengo derecho a que me expliquen con palabras sencillas?',
    response:
      '¡Totalmente! Es tu derecho fundamental. Si el médico o enfermera usa palabras médicas complejas que no entiendes, puedes decir con tranquilidad: "Doctor, por favor explíqueme en palabras sencillas qué tengo y cómo debo cuidarme". El equipo de salud tiene el deber de hacértelo entender.',
  },
  {
    id: 'faq_2',
    category: 'Consentimiento y 2.ª Opinión',
    title: '¿Puedo solicitar una segunda opinión médica antes de operarme?',
    response:
      'Sí. Tienes derecho a pedir otro concepto profesional ante diagnósticos de alta complejidad o cirugías mayores, y ningún tratamiento experimental o quirúrgico puede realizarse sin tu consentimiento informado previo firmado.',
  },
  {
    id: 'faq_3',
    category: 'Beneficio de Acompañante',
    title: '¿Quién puede acompañarme si estoy hospitalizado?',
    response:
      'Los niños, adultos mayores, personas con discapacidad o mujeres en trabajo de parto tienen derecho prioritario a contar con un acompañante permanente según las condiciones de bioseguridad del servicio. Además, tienes derecho a recibir apoyo psicológico o espiritual de tu fe.',
  },
  {
    id: 'faq_4',
    category: 'Deber de Documentación (DAR)',
    title: '¿Por qué debo ser puntual y llevar documentos reales?',
    response:
      'Presentar tu documento real garantiza que no se confunda tu historia clínica con la de otra persona, protegiendo tus exámenes y prescripciones. La puntualidad permite que el tiempo asignado a tu salud se aproveche al máximo sin retrasar a otros pacientes.',
  },
];

export const DariView: React.FC<DariViewProps> = ({ speech }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="mobile-tab-view" aria-labelledby="dari-view-title">
      {/* Tarjeta superior de Dari */}
      <div className="dari-educator-hero">
        <DariAvatar
          pose={speech.isSpeaking ? 'explaining' : 'welcome'}
          isSpeaking={speech.isSpeaking}
          size="lg"
        />
        <div className="dari-educator-texts">
          <span className="dari-educator-kicker">EDUCADOR HUMANIZADO</span>
          <h2 id="dari-view-title" className="dari-educator-title">
            Conversando con Dari
          </h2>
          <p className="dari-educator-desc">
            Respuestas directas y claras a las situaciones más comunes que vives
            en el hospital.
          </p>
        </div>
      </div>

      {/* Preguntas Frecuentes de Pacientes y Familias */}
      <div className="dari-faq-section">
        <h3 className="home-section-kicker">
          PREGUNTAS FRECUENTES DE PACIENTES Y FAMILIAS
        </h3>

        <div className="dari-faq-list">
          {DARI_FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const isPlayingThis =
              speech.isSpeaking && speech.activeId === faq.id;

            return (
              <div
                key={faq.id}
                className={`dari-faq-card ${isOpen ? 'faq-card-open' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  className="dari-faq-header-btn"
                >
                  <div className="dari-faq-header-texts">
                    <span className="dari-faq-cat">{faq.category}</span>
                    <h4 className="dari-faq-question">{faq.title}</h4>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`dari-faq-chevron ${
                      isOpen ? 'chevron-open' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div className="dari-faq-body">
                    <p className="dari-faq-answer">{faq.response}</p>
                    <button
                      type="button"
                      onClick={() =>
                        speech.toggleSpeak(faq.response, faq.id, {
                          preRecordedAudioUrl: getColombianAudioPath(faq.id),
                        })
                      }
                      className={`btn-faq-listen ${
                        isPlayingThis ? 'btn-faq-listen-active' : ''
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <Square
                            size={14}
                            fill="currentColor"
                            aria-hidden="true"
                          />
                          <span>Detener voz de Dari</span>
                        </>
                      ) : (
                        <>
                          <Volume2 size={15} aria-hidden="true" />
                          <span>Escuchar respuesta de Dari</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pie institucional humanizado */}
      <div className="dari-humanized-footer">
        <HeartHandshake
          size={22}
          className="humanized-footer-icon"
          aria-hidden="true"
        />
        <p>“El trato humanizado se construye entre todos: personal de salud y usuarios”.</p>
        <span>E.S.E. Hospital Universitario Erasmo Meoz • UFPS Enfermería</span>
      </div>
    </div>
  );
};
