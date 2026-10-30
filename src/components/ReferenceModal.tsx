import React, { useState } from 'react';
import {
  X,
  Volume2,
  Phone,
  Globe,
  MapPin,
  Clock,
  Image as ImageIcon,
  BookOpen,
} from 'lucide-react';
import {
  INSTITUTIONAL_PRINCIPLES,
  OFFICIAL_ATTENTION_CHANNELS,
} from '../data/institutionalContent';
import { getColombianAudioPath } from '../data/dariDialogues';
import { SpeechHook } from '../hooks/useSpeech';
import { IconBadge } from './IconBadge';

interface ReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  speech: SpeechHook;
}

export const ReferenceModal: React.FC<ReferenceModalProps> = ({
  isOpen,
  onClose,
  speech,
}) => {
  const [activeTab, setActiveTab] = useState<'acrostic' | 'channels' | 'posters'>(
    'acrostic'
  );

  if (!isOpen) return null;

  const darItems = INSTITUTIONAL_PRINCIPLES.filter((p) => p.category === 'DAR');
  const recibirItems = INSTITUTIONAL_PRINCIPLES.filter(
    (p) => p.category === 'RECIBIR'
  );

  const handleClose = () => {
    speech.stop();
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-ref-title"
    >
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <span className="modal-kicker">
              E.S.E. Hospital Universitario Erasmo Meoz
            </span>
            <h2 id="modal-ref-title" className="modal-title">
              Cartilla DAR Y RECIBIR • Trato Digno
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="btn-modal-close"
            aria-label="Cerrar cartilla de referencia"
          >
            <X size={24} aria-hidden="true" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Pestañas de navegación */}
        <div className="modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'acrostic'}
            onClick={() => setActiveTab('acrostic')}
            className={`modal-tab-btn ${
              activeTab === 'acrostic' ? 'tab-btn-active' : ''
            }`}
          >
            <BookOpen size={18} aria-hidden="true" />
            <span>Derechos y Deberes</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'channels'}
            onClick={() => setActiveTab('channels')}
            className={`modal-tab-btn ${
              activeTab === 'channels' ? 'tab-btn-active' : ''
            }`}
          >
            <Phone size={18} aria-hidden="true" />
            <span>Canales SIAU</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'posters'}
            onClick={() => setActiveTab('posters')}
            className={`modal-tab-btn ${
              activeTab === 'posters' ? 'tab-btn-active' : ''
            }`}
          >
            <ImageIcon size={18} aria-hidden="true" />
            <span>Afiches Oficiales</span>
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'acrostic' && (
            <div className="modal-section-content">
              <p className="modal-intro-note">
                “Cumpliendo nuestros deberes garantizamos tus derechos. E.S.E.
                Hospital Universitario Erasmo Meoz, ¡Un Hospital de Todos!”.
              </p>

              <h3 className="modal-group-heading heading-dar">
                DAR — Los 3 Deberes de los Usuarios
              </h3>
              <div className="modal-cards-list">
                {darItems.map((item) => (
                  <div key={item.id} className="modal-principle-row row-dar">
                    <div className="modal-letter-col letter-dar">
                      {item.letter}
                    </div>
                    <div className="modal-principle-info">
                      <div className="modal-principle-top">
                        <strong>{item.shortTitle}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            speech.toggleSpeak(
                              `Deber con la letra ${item.letter}: ${item.shortTitle}. ${item.officialText}. ${item.citizenExplanation}`,
                              `principle_${item.id}`,
                              {
                                preRecordedAudioUrl: getColombianAudioPath(
                                  `principle_${item.id}`
                                ),
                              }
                            )
                          }
                          className="btn-mini-audio"
                        >
                          <Volume2 size={16} aria-hidden="true" />
                          <span>Escuchar</span>
                        </button>
                      </div>
                      <p className="modal-official-text">{item.officialText}</p>
                      <p className="modal-example-text">
                        <IconBadge name={item.icon} size={16} />{' '}
                        {item.citizenExplanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="modal-group-heading heading-recibir">
                RECIBIR — Los 7 Derechos de los Usuarios
              </h3>
              <div className="modal-cards-list">
                {recibirItems.map((item) => (
                  <div
                    key={item.id}
                    className="modal-principle-row row-recibir"
                  >
                    <div className="modal-letter-col letter-recibir">
                      {item.letter}
                    </div>
                    <div className="modal-principle-info">
                      <div className="modal-principle-top">
                        <strong>{item.shortTitle}</strong>
                        <button
                          type="button"
                          onClick={() =>
                            speech.toggleSpeak(
                              `Derecho con la letra ${item.letter}: ${item.shortTitle}. ${item.officialText}. ${item.citizenExplanation}`,
                              `principle_${item.id}`,
                              {
                                preRecordedAudioUrl: getColombianAudioPath(
                                  `principle_${item.id}`
                                ),
                              }
                            )
                          }
                          className="btn-mini-audio"
                        >
                          <Volume2 size={16} aria-hidden="true" />
                          <span>Escuchar</span>
                        </button>
                      </div>
                      <p className="modal-official-text">{item.officialText}</p>
                      <p className="modal-example-text">
                        <IconBadge name={item.icon} size={16} />{' '}
                        {item.citizenExplanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="modal-section-content">
              <p className="modal-intro-note">
                Carta del Trato Digno del Ciudadano: Canales dispuestos para
                escuchar tus peticiones, quejas, reclamos, sugerencias, denuncias
                o felicitaciones (PQRSDF).
              </p>

              <div className="channels-grid">
                <div className="channel-card">
                  <h4>
                    <MapPin size={20} aria-hidden="true" /> Atención Presencial
                  </h4>
                  <ul>
                    {OFFICIAL_ATTENTION_CHANNELS.presencial.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="channel-card">
                  <h4>
                    <Phone size={20} aria-hidden="true" /> Atención Telefónica
                  </h4>
                  <ul>
                    {OFFICIAL_ATTENTION_CHANNELS.telefonica.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="channel-card">
                  <h4>
                    <Globe size={20} aria-hidden="true" /> Canal Virtual
                  </h4>
                  <ul>
                    {OFFICIAL_ATTENTION_CHANNELS.virtual.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>

                <div className="channel-card">
                  <h4>
                    <Clock size={20} aria-hidden="true" /> Horarios y Redes
                  </h4>
                  <ul>
                    {OFFICIAL_ATTENTION_CHANNELS.horarios.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                    {OFFICIAL_ATTENTION_CHANNELS.redes.map((line, i) => (
                      <li key={`r-${i}`}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posters' && (
            <div className="modal-section-content posters-gallery">
              <figure className="poster-figure">
                <figcaption>
                  1. Afiche Oficial: Deberes y Derechos de los Usuarios (DAR Y
                  RECIBIR)
                </figcaption>
                <img
                  src="/recursos/poster-derechos-deberes.jpeg"
                  alt="Afiche institucional de Deberes y Derechos de los Usuarios DAR y RECIBIR"
                  loading="lazy"
                />
              </figure>

              <figure className="poster-figure">
                <figcaption>
                  2. Afiche Oficial: Carta del Trato Digno del Ciudadano
                </figcaption>
                <img
                  src="/recursos/poster-trato-digno.jpeg"
                  alt="Afiche institucional Carta del Trato Digno del Ciudadano"
                  loading="lazy"
                />
              </figure>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={handleClose}
            className="btn-primary-xl"
          >
            <span>Volver al juego</span>
          </button>
        </div>
      </div>
    </div>
  );
};
