import { useState, useEffect, useCallback, useRef } from 'react';

export interface VoiceOptionItem {
  voiceURI: string;
  name: string;
  lang: string;
  isNaturalOrNeural: boolean;
  isColombian: boolean;
}

export interface SpeakOptions {
  preRecordedAudioUrl?: string;
}

export interface SpeechHook {
  isSupported: boolean;
  isSpeaking: boolean;
  isLoadingAudio: boolean;
  isMuted: boolean;
  activeId: string | null;
  lastSpokenText: string | null;
  voiceLabel: string;
  providerMode: 'neural-api' | 'prerecorded' | 'browser-tts';
  availableVoices: VoiceOptionItem[];
  selectedVoiceURI: string;
  setSelectedVoiceURI: (uri: string) => void;
  toggleMute: () => void;
  speak: (text: string, id?: string, options?: SpeakOptions) => void;
  repeatCurrent: (text: string, id?: string, options?: SpeakOptions) => void;
  stop: () => void;
  toggleSpeak: (text: string, id?: string, options?: SpeakOptions) => void;
}

export const COLOMBIAN_HUMAN_VOICES: VoiceOptionItem[] = [
  {
    voiceURI: 'colombian-gonzalo',
    name: '🇨🇴 Gonzalo — Voz Humana Colombiana (Masculina)',
    lang: 'es-CO',
    isNaturalOrNeural: true,
    isColombian: true,
  },
  {
    voiceURI: 'colombian-salome',
    name: '🇨🇴 Salomé — Voz Humana Colombiana (Femenina)',
    lang: 'es-CO',
    isNaturalOrNeural: true,
    isColombian: true,
  },
];

/**
 * Normaliza abreviaturas y signos para que el motor de voz pronuncie
 * con naturalidad, pausas conversacionales y claridad en términos de salud.
 */
export function normalizeTextForNaturalSpeech(rawText: string): string {
  return rawText
    .replace(/2\.ª/g, 'segunda')
    .replace(/1\.er/g, 'primer')
    .replace(/2\.º/g, 'segundo')
    .replace(/E\.S\.E\./g, 'E. S. E.,')
    .replace(/PQRSDF/g, 'peticiones, quejas, reclamos y sugerencias')
    .replace(/[•·]/g, ', ')
    .replace(/[“”"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Puntúa una voz del navegador para priorizar Español de Colombia (es-CO)
 * y voces Neurales / Naturales ("Natural", "Online", "Google", "Salome", "Gonzalo").
 */
function scoreSpanishVoice(v: SpeechSynthesisVoice): number {
  const lang = v.lang.toLowerCase().replace('_', '-');
  const name = v.name.toLowerCase();
  if (!lang.startsWith('es')) return -1;

  let score = 10;

  if (
    lang.startsWith('es-co') ||
    name.includes('colombia') ||
    name.includes('salome') ||
    name.includes('gonzalo')
  ) {
    score += 100;
  } else if (
    lang.startsWith('es-419') ||
    lang.startsWith('es-mx') ||
    lang.startsWith('es-us') ||
    lang.startsWith('es-ve') ||
    lang.startsWith('es-ec') ||
    lang.startsWith('es-pe') ||
    lang.startsWith('es-cl') ||
    lang.startsWith('es-ar')
  ) {
    score += 60;
  } else {
    score += 20;
  }

  if (
    name.includes('natural') ||
    name.includes('neural') ||
    name.includes('online') ||
    name.includes('premium') ||
    name.includes('enhanced')
  ) {
    score += 50;
  } else if (
    name.includes('google') ||
    name.includes('paulina') ||
    name.includes('sabina') ||
    name.includes('helena')
  ) {
    score += 25;
  }

  return score;
}

/**
 * Adapta la ruta de audio pregenerado según la voz humana colombiana elegida (Gonzalo o Salomé)
 */
function resolveColombianPreRecordedUrl(
  id: string,
  voiceURI: string,
  explicitUrl?: string
): string | null {
  if (voiceURI !== 'colombian-gonzalo' && voiceURI !== 'colombian-salome') {
    return null;
  }
  const folder = voiceURI === 'colombian-salome' ? 'salome' : 'gonzalo';
  if (explicitUrl) {
    return explicitUrl.replace(
      /\/recursos\/audio\/(gonzalo|salome)\//,
      `/recursos/audio/${folder}/`
    );
  }
  if (id && id !== 'default') {
    return `/recursos/audio/${folder}/${id}.mp3`;
  }
  return null;
}

export function useSpeech(): SpeechHook {
  const neuralApiUrl =
    (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_NEURAL_TTS_URL || '';

  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string | null>(null);
  const [voiceLabel, setVoiceLabel] = useState<string>(
    'Español Colombia (Voz Humana • Gonzalo)'
  );
  const [availableVoices, setAvailableVoices] = useState<VoiceOptionItem[]>(
    COLOMBIAN_HUMAN_VOICES
  );
  const [selectedVoiceURI, setSelectedVoiceURIState] =
    useState<string>('colombian-gonzalo');
  const [providerMode, setProviderMode] = useState<
    'neural-api' | 'prerecorded' | 'browser-tts'
  >('prerecorded');

  const selectedVoiceURIRef = useRef<string>('colombian-gonzalo');
  const voicesMapRef = useRef<Map<string, SpeechSynthesisVoice>>(new Map());
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);
  const neuralAudioCacheRef = useRef<Map<string, string>>(new Map());
  const utteranceSessionRef = useRef<number>(0);

  const updateVoicesList = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAvailableVoices(COLOMBIAN_HUMAN_VOICES);
      return;
    }
    const rawVoices = window.speechSynthesis.getVoices();
    if (!rawVoices || rawVoices.length === 0) {
      setAvailableVoices(COLOMBIAN_HUMAN_VOICES);
      return;
    }

    const scored = rawVoices
      .map((voice) => ({ voice, score: scoreSpanishVoice(voice) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const map = new Map<string, SpeechSynthesisVoice>();
    const browserOptions: VoiceOptionItem[] = scored.map(({ voice }) => {
      map.set(voice.voiceURI, voice);
      const langNorm = voice.lang.toLowerCase().replace('_', '-');
      const nameLower = voice.name.toLowerCase();
      return {
        voiceURI: voice.voiceURI,
        name: voice.name,
        lang: voice.lang,
        isNaturalOrNeural:
          nameLower.includes('natural') ||
          nameLower.includes('neural') ||
          nameLower.includes('online') ||
          nameLower.includes('google'),
        isColombian:
          langNorm.startsWith('es-co') ||
          nameLower.includes('colombia') ||
          nameLower.includes('salome') ||
          nameLower.includes('gonzalo'),
      };
    });

    voicesMapRef.current = map;
    if (browserOptions.length > 0 && !selectedVoiceRef.current) {
      selectedVoiceRef.current =
        map.get(browserOptions[0].voiceURI) || null;
    }

    setAvailableVoices([...COLOMBIAN_HUMAN_VOICES, ...browserOptions]);
  }, []);

  useEffect(() => {
    const hasAudio = typeof window !== 'undefined' && typeof Audio !== 'undefined';
    const hasSpeech =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';

    setIsSupported(hasAudio || hasSpeech || Boolean(neuralApiUrl));
    if (!hasSpeech) return;

    updateVoicesList();
    window.speechSynthesis.onvoiceschanged = () => {
      updateVoicesList();
    };

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause();
        htmlAudioRef.current = null;
      }
    };
  }, [updateVoicesList, neuralApiUrl]);

  const setSelectedVoiceURI = useCallback((uri: string) => {
    selectedVoiceURIRef.current = uri;
    setSelectedVoiceURIState(uri);

    if (uri === 'colombian-gonzalo') {
      setProviderMode('prerecorded');
      setVoiceLabel('Español Colombia (Voz Humana • Gonzalo)');
      return;
    }
    if (uri === 'colombian-salome') {
      setProviderMode('prerecorded');
      setVoiceLabel('Español Colombia (Voz Humana • Salomé)');
      return;
    }

    const found = voicesMapRef.current.get(uri);
    if (found) {
      selectedVoiceRef.current = found;
      setProviderMode('browser-tts');
      const langNorm = found.lang.toLowerCase().replace('_', '-');
      const nameLower = found.name.toLowerCase();
      const isCol =
        langNorm.startsWith('es-co') ||
        nameLower.includes('colombia') ||
        nameLower.includes('salome') ||
        nameLower.includes('gonzalo');
      const isNat =
        nameLower.includes('natural') ||
        nameLower.includes('neural') ||
        nameLower.includes('online');
      setVoiceLabel(
        isCol
          ? isNat
            ? 'Español Colombia (Voz Natural)'
            : 'Español (Colombia)'
          : isNat
          ? 'Español Latam (Voz Natural)'
          : 'Español'
      );
    }
  }, []);

  const stop = useCallback(() => {
    utteranceSessionRef.current += 1;
    setIsLoadingAudio(false);

    if (htmlAudioRef.current) {
      try {
        htmlAudioRef.current.pause();
        htmlAudioRef.current.currentTime = 0;
      } catch {
        // Ignorar errores de elemento de audio
      }
      htmlAudioRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignorar errores en navegadores restrictivos
      }
    }
    setIsSpeaking(false);
    setActiveId(null);
  }, []);

  /**
   * Reproduce mediante síntesis nativa del navegador dividiendo en frases naturales
   * para lograr pausas conversacionales y entonación más cálida.
   */
  const speakWithBrowserTTS = useCallback(
    (normalizedText: string, id: string, sessionToken: number) => {
      if (
        typeof window === 'undefined' ||
        !('speechSynthesis' in window) ||
        typeof SpeechSynthesisUtterance === 'undefined'
      ) {
        setActiveId(id);
        setIsSpeaking(false);
        return;
      }

      try {
        window.speechSynthesis.cancel();

        const rawClauses = normalizedText
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean);
        const clauses = rawClauses.length > 0 ? rawClauses : [normalizedText];

        setProviderMode('browser-tts');
        setIsSpeaking(true);
        setActiveId(id);

        let currentClauseIndex = 0;

        const speakNextClause = () => {
          if (utteranceSessionRef.current !== sessionToken) {
            return;
          }
          if (currentClauseIndex >= clauses.length) {
            setIsSpeaking(false);
            setActiveId(null);
            return;
          }

          const clauseText = clauses[currentClauseIndex];
          const utterance = new SpeechSynthesisUtterance(clauseText);
          utterance.lang = selectedVoiceRef.current?.lang || 'es-CO';
          if (selectedVoiceRef.current) {
            utterance.voice = selectedVoiceRef.current;
          }

          utterance.rate = 0.98;
          utterance.pitch = 1.02;

          utterance.onstart = () => {
            if (utteranceSessionRef.current === sessionToken) {
              setIsSpeaking(true);
              setActiveId(id);
            }
          };

          utterance.onend = () => {
            if (utteranceSessionRef.current !== sessionToken) return;
            currentClauseIndex += 1;
            if (currentClauseIndex < clauses.length) {
              window.setTimeout(speakNextClause, 110);
            } else {
              setIsSpeaking(false);
              setActiveId(null);
            }
          };

          utterance.onerror = () => {
            if (utteranceSessionRef.current === sessionToken) {
              setIsSpeaking(false);
              setActiveId(null);
            }
          };

          window.speechSynthesis.speak(utterance);
        };

        speakNextClause();
      } catch {
        setIsSpeaking(false);
        setActiveId(null);
      }
    },
    []
  );

  /**
   * Reproduce un archivo de audio (Opción C pregrabado colombiano u Opción A Neural TTS Blob)
   * con respaldo automático al navegador si falla.
   */
  const playAudioUrlWithFallback = useCallback(
    (
      audioUrl: string,
      fallbackText: string,
      id: string,
      sessionToken: number,
      mode: 'prerecorded' | 'neural-api'
    ) => {
      try {
        const audio = new Audio(audioUrl);
        htmlAudioRef.current = audio;
        setProviderMode(mode);
        setIsSpeaking(true);
        setActiveId(id);

        audio.onended = () => {
          if (utteranceSessionRef.current === sessionToken) {
            setIsSpeaking(false);
            setActiveId(null);
          }
        };

        audio.onerror = () => {
          if (utteranceSessionRef.current === sessionToken) {
            speakWithBrowserTTS(fallbackText, id, sessionToken);
          }
        };

        audio.play().catch((err: unknown) => {
          if (utteranceSessionRef.current !== sessionToken) return;
          const errorName =
            err && typeof err === 'object' && 'name' in err
              ? String((err as { name?: string }).name)
              : '';
          // Si el navegador bloquea el autoplay antes del primer toque, no forzar voz robótica
          if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
            setIsSpeaking(false);
            setActiveId(null);
            return;
          }
          speakWithBrowserTTS(fallbackText, id, sessionToken);
        });
      } catch {
        speakWithBrowserTTS(fallbackText, id, sessionToken);
      }
    },
    [speakWithBrowserTTS]
  );

  const speak = useCallback(
    (text: string, id = 'default', options?: SpeakOptions) => {
      const normalizedText = normalizeTextForNaturalSpeech(text);
      setLastSpokenText(text.replace(/\s+/g, ' ').trim());

      stop();

      if (isMuted) {
        return;
      }

      const sessionToken = utteranceSessionRef.current;
      const activeURI = selectedVoiceURIRef.current;

      // 1. Voces Humanas Neurales Colombianas integradas (Gonzalo / Salomé)
      const colombianAudioUrl = resolveColombianPreRecordedUrl(
        id,
        activeURI,
        options?.preRecordedAudioUrl
      );
      if (colombianAudioUrl) {
        playAudioUrlWithFallback(
          colombianAudioUrl,
          normalizedText,
          id,
          sessionToken,
          'prerecorded'
        );
        return;
      }

      // 2. Servicio de Voz Neural externo si está configurado (VITE_NEURAL_TTS_URL)
      if (neuralApiUrl) {
        const cachedBlobUrl = neuralAudioCacheRef.current.get(normalizedText);
        if (cachedBlobUrl) {
          playAudioUrlWithFallback(
            cachedBlobUrl,
            normalizedText,
            id,
            sessionToken,
            'neural-api'
          );
          return;
        }

        setIsLoadingAudio(true);
        setActiveId(id);
        fetch(neuralApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: normalizedText,
            lang: 'es-CO',
            voice: 'dari-colombia-warm',
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error('Neural TTS no disponible');
            return res.blob();
          })
          .then((blob) => {
            if (utteranceSessionRef.current !== sessionToken) return;
            setIsLoadingAudio(false);
            const blobUrl = URL.createObjectURL(blob);
            neuralAudioCacheRef.current.set(normalizedText, blobUrl);
            playAudioUrlWithFallback(
              blobUrl,
              normalizedText,
              id,
              sessionToken,
              'neural-api'
            );
          })
          .catch(() => {
            if (utteranceSessionRef.current !== sessionToken) return;
            setIsLoadingAudio(false);
            speakWithBrowserTTS(normalizedText, id, sessionToken);
          });
        return;
      }

      // 3. Voz del navegador con prosodia conversacional natural
      speakWithBrowserTTS(normalizedText, id, sessionToken);
    },
    [isMuted, neuralApiUrl, playAudioUrlWithFallback, speakWithBrowserTTS, stop]
  );

  const repeatCurrent = useCallback(
    (text: string, id = 'default', options?: SpeakOptions) => {
      if (isMuted) {
        setIsMuted(false);
      }
      const normalizedText = normalizeTextForNaturalSpeech(text);
      setLastSpokenText(text.replace(/\s+/g, ' ').trim());
      stop();
      const sessionToken = utteranceSessionRef.current;
      const activeURI = selectedVoiceURIRef.current;

      const colombianAudioUrl = resolveColombianPreRecordedUrl(
        id,
        activeURI,
        options?.preRecordedAudioUrl
      );
      if (colombianAudioUrl) {
        playAudioUrlWithFallback(
          colombianAudioUrl,
          normalizedText,
          id,
          sessionToken,
          'prerecorded'
        );
        return;
      }

      speakWithBrowserTTS(normalizedText, id, sessionToken);
    },
    [isMuted, playAudioUrlWithFallback, speakWithBrowserTTS, stop]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stop();
      }
      return next;
    });
  }, [stop]);

  const toggleSpeak = useCallback(
    (text: string, id = 'default', options?: SpeakOptions) => {
      if (isSpeaking && activeId === id) {
        stop();
      } else {
        if (isMuted) {
          setIsMuted(false);
        }
        repeatCurrent(text, id, options);
      }
    },
    [isSpeaking, activeId, isMuted, stop, repeatCurrent]
  );

  return {
    isSupported,
    isSpeaking,
    isLoadingAudio,
    isMuted,
    activeId,
    lastSpokenText,
    voiceLabel,
    providerMode,
    availableVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    toggleMute,
    speak,
    repeatCurrent,
    stop,
    toggleSpeak,
  };
}
