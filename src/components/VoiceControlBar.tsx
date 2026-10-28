import React from 'react';
import { Volume2, Square, CheckCircle2 } from 'lucide-react';
import { SpeechHook } from '../hooks/useSpeech';

interface VoiceControlBarProps {
  speech: SpeechHook;
  textToRead: string;
  audioId: string;
  buttonLabel?: string;
  compact?: boolean;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({
  speech,
  textToRead,
  audioId,
  buttonLabel = 'Escuchar en voz alta',
  compact = false,
}) => {
  const isPlayingThis = speech.isSpeaking && speech.activeId === audioId;
  const isFallbackActive =
    !speech.isSupported && speech.activeId === audioId && speech.lastSpokenText;

  return (
    <div
      className={`voice-bar-container ${compact ? 'voice-bar-compact' : ''}`}
      role="region"
      aria-label="Controles de lectura por voz"
    >
      <div className="voice-bar-actions">
        <button
          type="button"
          onClick={() => speech.toggleSpeak(textToRead, audioId)}
          className={`btn-voice ${isPlayingThis ? 'btn-voice-playing' : ''}`}
          aria-pressed={isPlayingThis}
          aria-label={
            isPlayingThis ? 'Detener lectura por voz' : `${buttonLabel}`
          }
        >
          {isPlayingThis ? (
            <>
              <Square size={20} className="voice-icon-pulse" aria-hidden="true" />
              <span>Detener voz</span>
            </>
          ) : (
            <>
              <Volume2 size={22} aria-hidden="true" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>

        {isPlayingThis && (
          <span className="voice-status-badge" aria-live="polite">
            <span className="voice-wave-dot" />
            Reproduciendo en {speech.voiceLabel}...
          </span>
        )}
      </div>

      {/* Alternativa accesible si el navegador no soporta Web Speech API o está activo el lector visual */}
      {isFallbackActive && (
        <div className="voice-fallback-box" role="status" aria-live="polite">
          <CheckCircle2 size={18} aria-hidden="true" />
          <p>
            <strong>Lectura asistida en pantalla:</strong> {textToRead}
          </p>
        </div>
      )}
    </div>
  );
};
