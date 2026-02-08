import { useCallback } from 'react';

/**
 * Hook for text-to-speech.
 * Currently uses the browser's SpeechSynthesis API.
 *
 * TODO: Integrate Eleven Labs API for more realistic voices.
 * https://elevenlabs.io/docs/api-reference/text-to-speech
 */
export function useVoice() {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Optional: Select a specific voice if available
      // const voices = window.speechSynthesis.getVoices();
      // utterance.voice = voices.find(voice => voice.name.includes('Google US English')) || null;

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech not supported in this browser.');
    }
  }, []);

  return { speak };
}
