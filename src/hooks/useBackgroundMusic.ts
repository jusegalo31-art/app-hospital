import { useState, useEffect, useRef, useCallback } from 'react';

const BG_MUSIC_STORAGE_KEY = 'huem_bg_music_muted_v1';
const BG_MUSIC_URL = '/recursos/audio/musica-fondo.mp3';

// Volumen suave de fondo para no saturar ni distraer
const VOLUME_NORMAL = 0.12;
// Volumen aún más bajo ("auto-ducking") cuando Dari está hablando
const VOLUME_DUCKED = 0.035;

export interface BackgroundMusicHook {
  isMusicMuted: boolean;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
}

/**
 * Hook ligero para gestionar la música ambiental de fondo:
 * - Carga diferida (lazy) para no afectar la velocidad inicial de la página.
 * - Atenuación automática ("ducking") cuando Dari habla para no interrumpir su voz.
 * - Control discreto para encender/apagar la música en cualquier momento.
 */
export function useBackgroundMusic(isDariSpeaking: boolean): BackgroundMusicHook {
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(BG_MUSIC_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedRef = useRef<boolean>(isMusicMuted);
  isMutedRef.current = isMusicMuted;

  const ensureAudioInstance = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioRef.current) {
      const audio = new Audio();
      audio.src = BG_MUSIC_URL;
      audio.loop = true;
      audio.preload = 'none';
      audio.volume = VOLUME_NORMAL;
      audio.onplay = () => setIsMusicPlaying(true);
      audio.onpause = () => setIsMusicPlaying(false);
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  // Atenuar automáticamente el volumen de la música cuando Dari está hablando
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isDariSpeaking ? VOLUME_DUCKED : VOLUME_NORMAL;
  }, [isDariSpeaking]);

  // Iniciar reproducción suave tras la primera interacción del usuario si no está silenciada
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tryStartMusic = () => {
      if (isMutedRef.current) return;
      const audio = ensureAudioInstance();
      if (audio && audio.paused) {
        audio.play().catch(() => {
          // El navegador espera interacción del usuario
        });
      }
    };

    const events = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((evt) =>
      window.addEventListener(evt, tryStartMusic, { once: true, passive: true })
    );

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, tryStartMusic));
    };
  }, [ensureAudioInstance]);

  // Sincronizar cuando el usuario activa o apaga la música
  useEffect(() => {
    const audio = audioRef.current;
    if (isMusicMuted) {
      if (audio && !audio.paused) {
        audio.pause();
      }
    } else {
      const instance = ensureAudioInstance();
      if (instance && instance.paused) {
        instance.play().catch(() => {});
      }
    }
  }, [isMusicMuted, ensureAudioInstance]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(BG_MUSIC_STORAGE_KEY, String(next));
      } catch {
        // Ignorar errores de almacenamiento
      }
      return next;
    });
  }, []);

  return {
    isMusicMuted,
    isMusicPlaying,
    toggleMusic,
  };
}
