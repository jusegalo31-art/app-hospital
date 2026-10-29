import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Clock,
} from 'lucide-react';

export const SiauView: React.FC = () => {
  const [subTab, setSubTab] = useState<'direct' | 'pqrsd' | 'locations'>(
    'direct'
  );

  return (
    <div className="mobile-tab-view" aria-labelledby="siau-view-title">
      <div className="tab-view-header">
        <h2 id="siau-view-title" className="tab-view-title">
          Canales de Atención SIAU
        </h2>
        <p className="tab-view-subtitle">
          Sistema de Información y Atención al Usuario • Trato Digno al
          Ciudadano
        </p>
      </div>

      {/* Sub-pestañas segmentadas */}
      <div
        className="segmented-tabs-bar"
        role="tablist"
        aria-label="Secciones de canales SIAU"
      >
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'direct'}
          onClick={() => setSubTab('direct')}
          className={`segmented-tab-btn ${
            subTab === 'direct' ? 'seg-active' : ''
          }`}
        >
          Líneas Rápidas
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'pqrsd'}
          onClick={() => setSubTab('pqrsd')}
          className={`segmented-tab-btn ${
            subTab === 'pqrsd' ? 'seg-active-dar' : ''
          }`}
        >
          ¿Cómo radicar PQRSD?
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={subTab === 'locations'}
          onClick={() => setSubTab('locations')}
          className={`segmented-tab-btn ${
            subTab === 'locations' ? 'seg-active' : ''
          }`}
        >
          Horarios y Sede
        </button>
      </div>

      {subTab === 'direct' && (
        <div className="siau-section-stack">
          <p className="siau-intro-note">
            Toca cualquiera de los canales oficiales para iniciar comunicación
            inmediata con el hospital:
          </p>

          <div className="siau-channels-list">
            <a
              href="https://wa.me/573144291269?text=Hola,%20solicito%20informaci%C3%B3n%20sobre%20asignaci%C3%B3n%20de%20citas%20HUEM"
              target="_blank"
              rel="noopener noreferrer"
              className="siau-action-card card-whatsapp"
            >
              <div className="siau-card-left">
                <div className="siau-icon-box icon-box-green">
                  <MessageCircle size={20} aria-hidden="true" />
                </div>
                <div className="siau-card-texts">
                  <div className="siau-card-title-row">
                    <strong>WhatsApp Asignación de Citas</strong>
                    <span className="siau-pill-247">24/7</span>
                  </div>
                  <p>+57 314 429 1269 • Chatbot automático</p>
                </div>
              </div>
              <ExternalLink
                size={16}
                className="siau-ext-icon icon-green"
                aria-hidden="true"
              />
            </a>

            <a href="tel:+576075892850" className="siau-action-card">
              <div className="siau-card-left">
                <div className="siau-icon-box icon-box-blue">
                  <Phone size={20} aria-hidden="true" />
                </div>
                <div className="siau-card-texts">
                  <strong>PBX Conmutador Principal</strong>
                  <p>(607) 589 2850 • Ext. 1126 - 1188 (SIAU)</p>
                </div>
              </div>
              <span className="siau-action-label label-blue">Llamar</span>
            </a>

            <a
              href="https://wa.me/573153499073?text=Hola,%20comunicaci%C3%B3n%20con%20L%C3%ADnea%20Amiga%20IAMII"
              target="_blank"
              rel="noopener noreferrer"
              className="siau-action-card"
            >
              <div className="siau-card-left">
                <div className="siau-icon-box icon-box-pink">
                  <MessageCircle size={20} aria-hidden="true" />
                </div>
                <div className="siau-card-texts">
                  <strong>Línea Amiga IAMII (Gestantes y Niños)</strong>
                  <p>315 349 9073 • Lactancia y salud materno infantil</p>
                </div>
              </div>
              <ExternalLink
                size={16}
                className="siau-ext-icon icon-pink"
                aria-hidden="true"
              />
            </a>

            <a
              href="mailto:asignaciondecitas@herasmomeoz.gov.co"
              className="siau-action-card"
            >
              <div className="siau-card-left">
                <div className="siau-icon-box icon-box-slate">
                  <Mail size={20} aria-hidden="true" />
                </div>
                <div className="siau-card-texts">
                  <strong>Correo para Citas Médicas</strong>
                  <p>asignaciondecitas@herasmomeoz.gov.co</p>
                </div>
              </div>
              <span className="siau-action-label label-slate">Escribir</span>
            </a>
          </div>
        </div>
      )}

      {subTab === 'pqrsd' && (
        <div className="siau-info-card">
          <h3>Carta del Trato Digno y Radicación de PQRSD</h3>
          <p className="siau-info-lead">
            Tienes el derecho pleno a manifestar tus inquietudes, reclamos,
            sugerencias o felicitaciones sin ningún tipo de retaliación.
          </p>

          <div className="siau-steps-list">
            <div className="siau-step-row">
              <span className="siau-step-badge">1</span>
              <div>
                <h4>Define el tipo de manifestación</h4>
                <p>
                  Petición (solicitud de información), Queja (inconformidad con
                  la atención), Reclamo (afectación de un derecho), Sugerencia o
                  Felicitación.
                </p>
              </div>
            </div>

            <div className="siau-step-row">
              <span className="siau-step-badge">2</span>
              <div>
                <h4>Aporta información clara</h4>
                <p>
                  Nombre completo, documento, teléfono de contacto, fecha de los
                  hechos y servicio donde ocurrió (Urgencias, Consulta,
                  Hospitalización).
                </p>
              </div>
            </div>

            <div className="siau-step-row">
              <span className="siau-step-badge">3</span>
              <div>
                <h4>Canales habilitados</h4>
                <p>
                  Buzón físico en salas de espera, ventanilla del SIAU en la
                  entrada principal o a través de la página web oficial.
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://herasmomeoz.gov.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-siau-portal"
          >
            <span>Ir al Portal Web Oficial HUEM</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
      )}

      {subTab === 'locations' && (
        <div className="siau-info-card">
          <div className="siau-location-block">
            <MapPin size={20} className="siau-loc-icon" aria-hidden="true" />
            <div>
              <h4>Sede Principal Hospital Erasmo Meoz</h4>
              <p>Avenida Guaimaral No. 5AN - 71, Cúcuta, Norte de Santander.</p>
              <span className="siau-highlight-line">
                Oficina SIAU: Ubicada directamente en la entrada principal.
              </span>
            </div>
          </div>

          <div className="siau-location-block border-top-subtle">
            <Clock size={20} className="siau-loc-icon" aria-hidden="true" />
            <div>
              <h4>Horarios de Atención Presencial SIAU</h4>
              <p>
                <strong>Lunes a Jueves:</strong> 7:00 a. m. - 12:00 m. y 2:00 p.
                m. - 6:00 p. m.
              </p>
              <p>
                <strong>Viernes:</strong> 7:00 a. m. - 12:00 m. y 2:00 p. m. -
                5:00 p. m.
              </p>
              <span className="siau-muted-footnote">
                * El servicio de Urgencias opera las 24 horas todos los días del
                año.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
