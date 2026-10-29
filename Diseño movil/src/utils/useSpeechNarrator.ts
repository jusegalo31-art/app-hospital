/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechNarrator() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setHasSpeechSupport(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentText(null);
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!hasSpeechSupport || isVoiceMuted) return;

      stop();

      try {
        const cleanText = text.replace(/[*_#`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95; // Clear, calm pacing for healthcare accessibility
        utterance.pitch = 1.05;

        // Try to pick a natural Spanish voice
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(
          (v) => v.lang.startsWith('es') || v.lang.includes('Spanish')
        );
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setCurrentText(text);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setCurrentText(null);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          setCurrentText(null);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        setIsSpeaking(false);
      }
    },
    [hasSpeechSupport, isVoiceMuted, stop]
  );

  const toggleMute = useCallback(() => {
    setIsVoiceMuted((prev) => {
      if (!prev) {
        stop();
      }
      return !prev;
    });
  }, [stop]);

  return {
    isSpeaking,
    currentText,
    isVoiceMuted,
    hasSpeechSupport,
    speak,
    stop,
    toggleMute,
  };
}
