import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Square,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DariDialogue } from '../types/game';
import { SpeechHook } from '../hooks/useSpeech';
import { DariAvatar } from './DariAvatar';

interface DariGuideBarProps {
  dialogue: DariDialogue;
  speech: SpeechHook;
  secondaryDialogue?: DariDialogue;
  secondaryButtonLabel?: string;
  compact?: boolean;
}

/**
 * Barra compacta de acompañamiento de "Dari" optimizada para móvil.
 * El cuadro de texto aparece comprimido en 1 línea por defecto con opción de expandir,
 * para no ocupar demasiado espacio en los retos.
 */
export const DariGuideBar: React.FC<DariGuideBarProps> = ({
  dialogue,
  speech,
  secondaryDialogue,
  secondaryButtonLabel,
  compact = false,
}) => {
  const [activeTipMode, setActiveTipMode] = useState<'main' | 'secondary'>(
    'main'
  );
  // Comprimido por defecto para ahorrar espacio vertical en los retos
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const lastAutoSpokenIdRef = useRef<string | null>(null);

  useEffect(() => {
    setActiveTipMode('main');
  }, [dialogue.id]);

  // Acompañamiento automático con voz humana colombiana durante los retos y resultados
  useEffect(() => {
    if (dialogue.id === 'welcome_greeting') {
      return;
    }
    if (lastAutoSpokenIdRef.current === dialogue.id) {
      return;
    }
    lastAutoSpokenIdRef.current = dialogue.id;
    if (!speech.isMuted) {
      speech.speak(dialogue.spokenText || dialogue.text, dialogue.id, {
        preRecordedAudioUrl: dialogue.preRecordedAudioUrl,
      });
    }
  }, [
    dialogue.id,
    dialogue.spokenText,
    dialogue.text,
    dialogue.preRecordedAudioUrl,
    speech,
  ]);

  const displayedDialogue =
    activeTipMode === 'secondary' && secondaryDialogue
      ? secondaryDialogue
      : dialogue;

  const isPlayingThis =
    speech.isSpeaking && speech.activeId === displayedDialogue.id;

  const handleTogglePlay = () => {
    if (isPlayingThis) {
      speech.stop();
      return;
    }
    speech.repeatCurrent(
      displayedDialogue.spokenText || displayedDialogue.text,
      displayedDialogue.id,
      { preRecordedAudioUrl: displayedDialogue.preRecordedAudioUrl }
    );
  };

  const handleSwitchSecondary = () => {
    if (!secondaryDialogue) return;
    const nextMode = activeTipMode === 'main' ? 'secondary' : 'main';
    setActiveTipMode(nextMode);
    setIsExpanded(true);
    const target = nextMode === 'secondary' ? secondaryDialogue : dialogue;
    if (!speech.isMuted) {
      speech.speak(target.spokenText || target.text, target.id, {
        preRecordedAudioUrl: target.preRecordedAudioUrl,
      });
    }
  };

  return (
    <aside
      className={`dari-inline-guide dari-companion-card ${
        compact ? 'dari-inline-compact' : ''
      } ${isExpanded ? 'dari-guide-expanded' : 'dari-guide-collapsed'} ${
        isPlayingThis ? 'dari-inline-speaking' : ''
      } pose-tone-${displayedDialogue.pose}`}
      aria-label="Guía personal Dari"
    >
      <button
        type="button"
        onClick={handleTogglePlay}
        className="dari-avatar-trigger"
        title={
          isPlayingThis
            ? 'Toca para detener la voz'
            : 'Toca para escuchar a Dari'
        }
        aria-label={isPlayingThis ? 'Detener voz de Dari' : 'Escuchar a Dari'}
      >
        <DariAvatar
          pose={displayedDialogue.pose}
          isSpeaking={isPlayingThis}
          size="sm"
        />
      </button>

      <div className="dari-inline-body" role="status" aria-live="polite">
        <div
          className="dari-inline-top"
          onClick={() => setIsExpanded((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded((prev) => !prev);
            }
          }}
        >
          <div className="dari-inline-title-group">
            <strong className="dari-inline-kicker">
              {displayedDialogue.speakerTitle}
            </strong>
            {isPlayingThis && (
              <span className="dari-speaking-badge">Hablando...</span>
            )}
          </div>

          <span className="btn-expand-dari-text">
            {isExpanded ? (
              <>
                <span>Comprimir</span>
                <ChevronUp size={14} aria-hidden="true" />
              </>
            ) : (
              <>
                <span>Expandir</span>
                <ChevronDown size={14} aria-hidden="true" />
              </>
            )}
          </span>
        </div>

        <p
          onClick={() => setIsExpanded((prev) => !prev)}
          className={`dari-inline-text dari-bubble-text ${
            isExpanded ? '' : 'dari-text-compressed'
          }`}
          id={`dari-text-${displayedDialogue.id}`}
          title={
            isExpanded
              ? 'Toca para comprimir el texto'
              : 'Toca para expandir el texto completo'
          }
        >
          {displayedDialogue.text}
        </p>

        {isExpanded && secondaryDialogue && secondaryButtonLabel && (
          <button
            type="button"
            onClick={handleSwitchSecondary}
            className="btn-dari-inline-tip"
          >
            {activeTipMode === 'main'
              ? secondaryButtonLabel
              : 'Volver al saludo de Dari'}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={handleTogglePlay}
        className={`btn-dari-audio-icon ${isPlayingThis ? 'audio-active' : ''}`}
        title={isPlayingThis ? 'Detener narración' : 'Escuchar mensaje de Dari'}
        aria-label={
          isPlayingThis
            ? 'Detener narración de Dari'
            : 'Escuchar mensaje de Dari en voz alta'
        }
      >
        {isPlayingThis ? (
          <Square size={15} fill="currentColor" aria-hidden="true" />
        ) : (
          <Volume2 size={17} aria-hidden="true" />
        )}
        <span className="sr-only">
          {isPlayingThis ? 'Detener' : 'Escuchar a Dari'}
        </span>
      </button>

      {isPlayingThis && (
        <button
          type="button"
          onClick={() =>
            speech.repeatCurrent(
              displayedDialogue.spokenText || displayedDialogue.text,
              displayedDialogue.id,
              { preRecordedAudioUrl: displayedDialogue.preRecordedAudioUrl }
            )
          }
          className="btn-dari-audio-icon"
          title="Repetir desde el inicio"
          aria-label="Repetir mensaje de Dari"
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
      )}
    </aside>
  );
};
