import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Square,
  RotateCcw,
  SlidersHorizontal,
  Loader2,
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
 * Componente Integrado de Acompañamiento de "Dari"
 * Muestra a Dari con su estado visual actual, su globo de diálogo contextual escrito
 * y los controles accesibles para escuchar, repetir, detener, silenciar o cambiar la voz.
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
  const [showVoicePicker, setShowVoicePicker] = useState<boolean>(false);
  const lastAutoSpokenIdRef = useRef<string | null>(null);

  // Reiniciar modo secundario cuando cambia el diálogo principal
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

  const handlePlayOrRepeat = () => {
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
    const target = nextMode === 'secondary' ? secondaryDialogue : dialogue;
    if (!speech.isMuted) {
      speech.speak(target.spokenText || target.text, target.id, {
        preRecordedAudioUrl: target.preRecordedAudioUrl,
      });
    }
  };

  return (
    <aside
      className={`dari-companion-card ${compact ? 'dari-companion-compact' : ''} ${
        isPlayingThis ? 'dari-companion-speaking' : ''
      } pose-border-${displayedDialogue.pose}`}
      aria-label="Guía personal Dari"
    >
      <div className="dari-companion-main">
        {/* Columna del Avatar Animado Dari */}
        <div className="dari-companion-avatar-col">
          <DariAvatar
            pose={displayedDialogue.pose}
            isSpeaking={isPlayingThis}
            size={compact ? 'sm' : 'md'}
          />
          <span className="dari-name-tag">Dari</span>
        </div>

        {/* Globo de Diálogo Contextual Escrito */}
        <div className="dari-speech-bubble" role="status" aria-live="polite">
          <div className="dari-bubble-header">
            <strong className="dari-speaker-title">
              {displayedDialogue.speakerTitle}
            </strong>

            {isPlayingThis && (
              <span className="dari-live-audio-pill">
                <span className="voice-wave-dot" />
                Hablando...
              </span>
            )}

            {speech.isLoadingAudio && (
              <span className="dari-live-audio-pill">
                <Loader2 size={14} className="spin-icon" aria-hidden="true" />
                Preparando voz...
              </span>
            )}
          </div>

          <p className="dari-bubble-text" id={`dari-text-${displayedDialogue.id}`}>
            “{displayedDialogue.text}”
          </p>

          {/* Botón opcional para alternar explicación inicial en la bienvenida */}
          {secondaryDialogue && secondaryButtonLabel && (
            <div className="dari-bubble-extra-row">
              <button
                type="button"
                onClick={handleSwitchSecondary}
                className="btn-dari-inline-tip"
              >
                {activeTipMode === 'main'
                  ? secondaryButtonLabel
                  : 'Volver al saludo de Dari'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controles Accesibles de Voz (Escuchar/Repetir, Detener, Activar/Desactivar Audio, Cambiar Voz) */}
      <div
        className="dari-voice-controls-row"
        role="group"
        aria-label="Controles de voz de Dari"
      >
        {/* Botón Principal: Escuchar / Repetir mensaje */}
        <button
          type="button"
          onClick={handlePlayOrRepeat}
          className={`btn-voice btn-dari-listen ${
            isPlayingThis ? 'btn-dari-listen-active' : ''
          }`}
          aria-label={
            isPlayingThis
              ? 'Repetir mensaje de Dari desde el principio'
              : 'Escuchar o repetir mensaje de Dari en voz alta'
          }
        >
          {isPlayingThis ? (
            <>
              <RotateCcw size={20} aria-hidden="true" />
              <span>Repetir mensaje</span>
            </>
          ) : (
            <>
              <Volume2 size={21} aria-hidden="true" />
              <span>Escuchar a Dari</span>
            </>
          )}
        </button>

        {/* Botón Detener Voz (visible cuando Dari está hablando) */}
        {speech.isSpeaking && (
          <button
            type="button"
            onClick={speech.stop}
            className="btn-dari-stop"
            aria-label="Detener la voz de Dari"
          >
            <Square size={19} fill="currentColor" aria-hidden="true" />
            <span>Detener</span>
          </button>
        )}

        {/* Control Activar / Desactivar Audio */}
        <button
          type="button"
          onClick={speech.toggleMute}
          className={`btn-dari-mute ${speech.isMuted ? 'btn-dari-muted' : ''}`}
          aria-pressed={speech.isMuted}
          aria-label={
            speech.isMuted
              ? 'Audio desactivado. Toca para activar la voz de Dari'
              : 'Audio activado. Toca para silenciar la voz de Dari'
          }
          title={
            speech.isMuted ? 'Activar voz de Dari' : 'Silenciar voz de Dari'
          }
        >
          {speech.isMuted ? (
            <>
              <VolumeX size={19} aria-hidden="true" />
              <span>Sin sonido</span>
            </>
          ) : (
            <>
              <Volume2 size={19} aria-hidden="true" />
              <span>Voz activa</span>
            </>
          )}
        </button>

        {/* Botón para cambiar la voz en español si el dispositivo ofrece varias alternativas */}
        {speech.availableVoices.length > 1 && (
          <button
            type="button"
            onClick={() => setShowVoicePicker((prev) => !prev)}
            className="btn-dari-voice-settings"
            aria-expanded={showVoicePicker}
            aria-label="Seleccionar voz en español disponible en tu dispositivo"
            title="Cambiar voz"
          >
            <SlidersHorizontal size={18} aria-hidden="true" />
            <span>Voz</span>
          </button>
        )}
      </div>

      {/* Selector desplegable de voces con acento colombiano integradas y voces del dispositivo */}
      {showVoicePicker && speech.availableVoices.length > 1 && (
        <div className="dari-voice-picker-panel">
          <label htmlFor="dari-voice-select" className="voice-picker-label">
            Acento y voz de Dari ({speech.voiceLabel}):
          </label>
          <select
            id="dari-voice-select"
            value={speech.selectedVoiceURI}
            onChange={(e) => {
              const newUri = e.target.value;
              speech.setSelectedVoiceURI(newUri);
              if (!speech.isMuted) {
                speech.repeatCurrent(
                  displayedDialogue.spokenText || displayedDialogue.text,
                  displayedDialogue.id,
                  { preRecordedAudioUrl: displayedDialogue.preRecordedAudioUrl }
                );
              }
            }}
            className="voice-picker-select"
          >
            {speech.availableVoices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
                {v.isColombian && !v.name.includes('Colombiana')
                  ? ' • Colombia'
                  : ''}
                {v.isNaturalOrNeural && !v.name.includes('Humana')
                  ? ' ★ Natural'
                  : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </aside>
  );
};
