import React, { useState, useMemo } from 'react';
import {
  Search,
  Info,
  Volume2,
  Square,
  Image as ImageIcon,
} from 'lucide-react';
import { INSTITUTIONAL_PRINCIPLES } from '../data/institutionalContent';
import { getColombianAudioPath } from '../data/dariDialogues';
import { SpeechHook } from '../hooks/useSpeech';
import { IconBadge } from './IconBadge';

interface CartillaViewProps {
  speech: SpeechHook;
  initialFilter?: 'all' | 'DAR' | 'RECIBIR' | 'posters';
}

function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export const CartillaView: React.FC<CartillaViewProps> = ({
  speech,
  initialFilter = 'all',
}) => {
  const [filter, setFilter] = useState<'all' | 'DAR' | 'RECIBIR' | 'posters'>(
    initialFilter
  );
  const [query, setQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPrinciples = useMemo(() => {
    const q = normalizeSearch(query);
    return INSTITUTIONAL_PRINCIPLES.filter((item) => {
      if (filter === 'DAR' && item.category !== 'DAR') return false;
      if (filter === 'RECIBIR' && item.category !== 'RECIBIR') return false;
      if (!q) return true;
      return (
        normalizeSearch(item.shortTitle).includes(q) ||
        normalizeSearch(item.officialText).includes(q) ||
        normalizeSearch(item.citizenExplanation).includes(q) ||
        normalizeSearch(item.practicalExample).includes(q) ||
        normalizeSearch(item.letter) === q
      );
    });
  }, [filter, query]);

  const handleSpeakPrinciple = (item: (typeof INSTITUTIONAL_PRINCIPLES)[0]) => {
    const clipId = `principle_${item.id}`;
    const text = `${
      item.category === 'DAR' ? 'Deber' : 'Derecho'
    } con la letra ${item.letter} de ${item.category}: ${item.shortTitle}. ${
      item.officialText
    } ${item.citizenExplanation}`;
    speech.toggleSpeak(text, clipId, {
      preRecordedAudioUrl: getColombianAudioPath(clipId),
    });
  };

  return (
    <div className="mobile-tab-view" aria-labelledby="cartilla-view-title">
      <div className="tab-view-header">
        <h2 id="cartilla-view-title" className="tab-view-title">
          Cartilla Oficial DAR y RECIBIR
        </h2>
        <p className="tab-view-subtitle">
          Conoce cada derecho y deber de forma clara, con ejemplos prácticos y
          voz guía colombiana.
        </p>
      </div>

      {/* Pestañas de filtro segmentadas */}
      <div
        className="segmented-tabs-bar"
        role="tablist"
        aria-label="Filtrar derechos y deberes"
      >
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          onClick={() => setFilter('all')}
          className={`segmented-tab-btn ${filter === 'all' ? 'seg-active' : ''}`}
        >
          Todos (10)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'DAR'}
          onClick={() => setFilter('DAR')}
          className={`segmented-tab-btn ${
            filter === 'DAR' ? 'seg-active-dar' : ''
          }`}
        >
          DAR: 3 Deberes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'RECIBIR'}
          onClick={() => setFilter('RECIBIR')}
          className={`segmented-tab-btn ${
            filter === 'RECIBIR' ? 'seg-active-recibir' : ''
          }`}
        >
          RECIBIR: 7 Derechos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'posters'}
          onClick={() => setFilter('posters')}
          className={`segmented-tab-btn ${
            filter === 'posters' ? 'seg-active' : ''
          }`}
        >
          Afiches
        </button>
      </div>

      {filter === 'posters' ? (
        <div className="cartilla-posters-stack">
          <figure className="cartilla-poster-card">
            <figcaption>
              <ImageIcon size={16} aria-hidden="true" />
              <span>
                1. Afiche Oficial: Deberes y Derechos de los Usuarios (DAR Y
                RECIBIR)
              </span>
            </figcaption>
            <img
              src="/recursos/poster-derechos-deberes.jpeg"
              alt="Afiche institucional de Deberes y Derechos de los Usuarios DAR y RECIBIR"
              loading="lazy"
            />
          </figure>

          <figure className="cartilla-poster-card">
            <figcaption>
              <ImageIcon size={16} aria-hidden="true" />
              <span>2. Afiche Oficial: Carta del Trato Digno del Ciudadano</span>
            </figcaption>
            <img
              src="/recursos/poster-trato-digno.jpeg"
              alt="Afiche institucional Carta del Trato Digno del Ciudadano"
              loading="lazy"
            />
          </figure>
        </div>
      ) : (
        <>
          {/* Buscador en tiempo real */}
          <div className="cartilla-search-box">
            <Search
              size={16}
              className="cartilla-search-icon"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar deber, derecho, cita, norma..."
              className="cartilla-search-input"
              aria-label="Buscar principio en la cartilla"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="cartilla-search-clear"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="cartilla-meta-row">
            <span>Mostrando {filteredPrinciples.length} principios</span>
            <span className="cartilla-meta-hint">
              <Info size={13} aria-hidden="true" />
              Toca cualquier tarjeta para expandir
            </span>
          </div>

          <div className="cartilla-cards-stack">
            {filteredPrinciples.map((item) => {
              const isDar = item.category === 'DAR';
              const isExpanded = expandedId === item.id;
              const clipId = `principle_${item.id}`;
              const isPlaying =
                speech.isSpeaking && speech.activeId === clipId;

              return (
                <article
                  key={item.id}
                  className={`cartilla-item-card ${
                    isPlaying ? 'cartilla-item-speaking' : ''
                  }`}
                >
                  <div
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedId(isExpanded ? null : item.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    className="cartilla-item-summary"
                  >
                    <div
                      className={`cartilla-letter-box ${
                        isDar ? 'letter-box-dar' : 'letter-box-recibir'
                      }`}
                    >
                      {item.letter}
                    </div>

                    <div className="cartilla-item-texts">
                      <div className="cartilla-item-tags">
                        <span
                          className={`cartilla-cat-tag ${
                            isDar ? 'cat-tag-dar' : 'cat-tag-recibir'
                          }`}
                        >
                          {isDar
                            ? 'DEBER DEL USUARIO (DAR)'
                            : 'DERECHO DEL USUARIO (RECIBIR)'}
                        </span>
                        <span className="cartilla-tag-dot">·</span>
                        <span className="cartilla-role-tag">
                          {isDar
                            ? 'Compromiso ciudadano'
                            : 'Garantía en salud'}
                        </span>
                      </div>

                      <h3 className="cartilla-item-title">{item.shortTitle}</h3>
                      <p className="cartilla-item-short">
                        {item.citizenExplanation}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakPrinciple(item);
                      }}
                      className={`cartilla-audio-btn ${
                        isPlaying ? 'audio-btn-playing' : ''
                      }`}
                      title={`Escuchar ${item.shortTitle}`}
                      aria-label={`Escuchar ${item.shortTitle}`}
                    >
                      {isPlaying ? (
                        <Square size={15} fill="currentColor" />
                      ) : (
                        <Volume2 size={17} />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="cartilla-item-details">
                      <div className="cartilla-detail-block">
                        <h4>DEFINICIÓN OFICIAL</h4>
                        <p>“{item.officialText.replace(/\.$/, '')}”.</p>
                      </div>

                      <div className="cartilla-practical-box">
                        <div className="practical-box-head">
                          <IconBadge name={item.icon} size={16} />
                          <span>¿Cómo se aplica en la práctica?</span>
                        </div>
                        <p>{item.practicalExample}</p>
                      </div>

                      <div className="cartilla-detail-actions">
                        <button
                          type="button"
                          onClick={() => handleSpeakPrinciple(item)}
                          className="btn-cartilla-listen-detail"
                        >
                          <Volume2 size={15} aria-hidden="true" />
                          <span>
                            {isPlaying
                              ? 'Detener narración'
                              : 'Escuchar explicación con Dari'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedId(null)}
                          className="btn-cartilla-close-detail"
                        >
                          Cerrar detalle
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}

            {filteredPrinciples.length === 0 && (
              <div className="cartilla-empty-state">
                <p>No se encontraron resultados para “{query}”</p>
                <span>
                  Prueba buscando palabras como “citas”, “nombre”,
                  “acompañante” o “respeto”.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setFilter('all');
                  }}
                  className="btn-cartilla-reset"
                >
                  Restablecer búsqueda
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
