import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_KEY = 'clinica-monstruitos-sound-enabled-v1';

type AudioContextConstructor = typeof AudioContext;

interface WindowWithAudio extends Window {
  webkitAudioContext?: AudioContextConstructor;
}

function getAudioContextConstructor(): AudioContextConstructor | undefined {
  const audioWindow = window as WindowWithAudio;
  return window.AudioContext ?? audioWindow.webkitAudioContext;
}

export function useCalmSound() {
  const [isSoundOn, setIsSoundOn] = useState(() => window.localStorage.getItem(SOUND_KEY) === 'true');
  const contextRef = useRef<AudioContext | null>(null);
  const ambientTimerRef = useRef<number | null>(null);
  const ambientStepRef = useRef(0);

  const getContext = useCallback(() => {
    if (contextRef.current) return contextRef.current;

    const AudioContextClass = getAudioContextConstructor();
    if (!AudioContextClass) return null;

    contextRef.current = new AudioContextClass();
    return contextRef.current;
  }, []);

  const resumeAudio = useCallback(async () => {
    const context = getContext();
    if (!context) return null;
    if (context.state === 'suspended') {
      await context.resume();
    }
    return context;
  }, [getContext]);

  const playTone = useCallback(
    async (frequency: number, startOffset: number, duration: number, volume = 0.045) => {
      if (!isSoundOn) return;

      const context = await resumeAudio();
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime + startOffset;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.04);
    },
    [isSoundOn, resumeAudio],
  );

  const playCorrect = useCallback(() => {
    void playTone(523.25, 0, 0.32, 0.04);
    void playTone(659.25, 0.12, 0.34, 0.035);
    void playTone(783.99, 0.26, 0.42, 0.03);
  }, [playTone]);

  const playRetry = useCallback(() => {
    void playTone(392, 0, 0.24, 0.028);
    void playTone(349.23, 0.16, 0.32, 0.024);
  }, [playTone]);

  const playHint = useCallback(() => {
    void playTone(440, 0, 0.22, 0.025);
    void playTone(554.37, 0.15, 0.28, 0.024);
  }, [playTone]);

  const playComplete = useCallback(() => {
    void playTone(523.25, 0, 0.32, 0.04);
    void playTone(659.25, 0.16, 0.36, 0.035);
    void playTone(783.99, 0.34, 0.42, 0.032);
    void playTone(1046.5, 0.58, 0.52, 0.026);
  }, [playTone]);

  const playAmbientPulse = useCallback(async () => {
    if (!isSoundOn) return;

    const context = await resumeAudio();
    if (!context) return;

    const chords = [
      [261.63, 329.63, 392],
      [293.66, 349.23, 440],
      [246.94, 329.63, 392],
      [261.63, 349.23, 415.3],
    ];
    const chord = chords[ambientStepRef.current % chords.length];
    ambientStepRef.current += 1;

    chord.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime + index * 0.08;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 3.8);
    });
  }, [isSoundOn, resumeAudio]);

  const toggleSound = useCallback(async () => {
    const nextValue = !isSoundOn;
    setIsSoundOn(nextValue);
    window.localStorage.setItem(SOUND_KEY, String(nextValue));

    if (nextValue) {
      await resumeAudio();
      void playTone(523.25, 0, 0.22, 0.035);
      void playTone(659.25, 0.14, 0.28, 0.03);
    }
  }, [isSoundOn, playTone, resumeAudio]);

  useEffect(() => {
    if (!isSoundOn) {
      if (ambientTimerRef.current) {
        window.clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = null;
      }
      return;
    }

    void playAmbientPulse();
    ambientTimerRef.current = window.setInterval(() => {
      void playAmbientPulse();
    }, 5200);

    return () => {
      if (ambientTimerRef.current) {
        window.clearInterval(ambientTimerRef.current);
        ambientTimerRef.current = null;
      }
    };
  }, [isSoundOn, playAmbientPulse]);

  return {
    isSoundOn,
    toggleSound,
    playCorrect,
    playRetry,
    playHint,
    playComplete,
  };
}
