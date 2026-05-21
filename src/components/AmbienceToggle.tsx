import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** Your own MP3 (any length) — preferred */
const LOCAL_RECITATION = "/audio/surah-yaseen.mp3";

/** Surah Yaseen, ayat 1–12 (Mishary Alafasy) — ~3–4 min fallback */
const SURAH_NUMBER = 36;
const PLAYLIST_AYAH_COUNT = 12;
const QARI_PATH = "Alafasy_128kbps";
const AUTO_PLAY_DELAY_MS = 600;

function ayahAudioUrl(ayah: number) {
  const s = String(SURAH_NUMBER).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${QARI_PATH}/${s}${a}.mp3`;
}

const TARGET_VOLUME = 0.38;
const FADE_MS = 1200;

type AmbienceToggleProps = {
  /** When true (e.g. loader finished), tilawat auto-starts */
  autoPlayWhenReady?: boolean;
};

export function AmbienceToggle({ autoPlayWhenReady = false }: AmbienceToggleProps) {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const playlistActiveRef = useRef(false);
  const ayahIndexRef = useRef(1);
  const endedHandlerRef = useRef<(() => void) | null>(null);
  const userMutedRef = useRef(false);
  const autoStartedRef = useRef(false);

  const clearFade = () => {
    if (fadeRef.current != null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const detachEnded = (audio: HTMLAudioElement) => {
    if (endedHandlerRef.current) {
      audio.removeEventListener("ended", endedHandlerRef.current);
      endedHandlerRef.current = null;
    }
  };

  const stopAudio = useCallback(() => {
    clearFade();
    playlistActiveRef.current = false;
    const audio = audioRef.current;
    if (!audio) return;
    detachEnded(audio);
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";
    audioRef.current = null;
  }, []);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  const fadeVolume = (audio: HTMLAudioElement, to: number, done?: () => void) => {
    clearFade();
    const from = audio.volume;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (to - from) * t;
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step);
      } else {
        fadeRef.current = null;
        done?.();
      }
    };
    fadeRef.current = requestAnimationFrame(step);
  };

  const waitForSource = (audio: HTMLAudioElement, src: string) =>
    new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        reject(new Error("load failed"));
      };
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onReady);
        audio.removeEventListener("error", onErr);
      };
      audio.addEventListener("canplaythrough", onReady);
      audio.addEventListener("error", onErr);
      audio.src = src;
      audio.load();
    });

  const playSrc = async (audio: HTMLAudioElement, src: string, fadeIn: boolean) => {
    await waitForSource(audio, src);
    if (!audioRef.current) return;
    await audio.play();
    if (fadeIn) {
      fadeVolume(audio, TARGET_VOLUME);
    } else {
      audio.volume = TARGET_VOLUME;
    }
  };

  const playSingleFile = async (src: string) => {
    const audio = new Audio();
    audio.preload = "none";
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;
    playlistActiveRef.current = false;
    await playSrc(audio, src, true);
  };

  const playAyah = async (ayah: number, fadeIn: boolean) => {
    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audio.preload = "none";
      audio.loop = false;
      audio.volume = 0;
      audioRef.current = audio;
    }
    ayahIndexRef.current = ayah;
    await playSrc(audio, ayahAudioUrl(ayah), fadeIn);
  };

  const startPlaylist = useCallback(async () => {
    playlistActiveRef.current = true;
    ayahIndexRef.current = 1;

    const audio = new Audio();
    audio.preload = "none";
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;

    const onEnded = () => {
      if (!playlistActiveRef.current || audioRef.current !== audio) return;

      const next = ayahIndexRef.current + 1;
      if (next > PLAYLIST_AYAH_COUNT) {
        fadeVolume(audio, 0, () => {
          stopAudio();
          setOn(false);
          setBusy(false);
        });
        return;
      }

      void playAyah(next, false).catch(() => {
        stopAudio();
        setOn(false);
        setBusy(false);
      });
    };

    endedHandlerRef.current = onEnded;
    audio.addEventListener("ended", onEnded);

    await playAyah(1, true);
  }, [stopAudio]);

  const startRecitation = useCallback(async () => {
    try {
      await playSingleFile(LOCAL_RECITATION);
    } catch {
      stopAudio();
      await startPlaylist();
    }
    setOn(true);
  }, [startPlaylist, stopAudio]);

  const tryAutoPlay = useCallback(async () => {
    if (userMutedRef.current || on || busy) return;

    setBusy(true);
    try {
      await startRecitation();
      autoStartedRef.current = true;
    } catch {
      /* Browser blocked autoplay — wait for first tap */
      return;
    } finally {
      setBusy(false);
    }
  }, [busy, on, startRecitation]);

  /* Auto-play after loader; fallback: first tap anywhere on page */
  useEffect(() => {
    if (!autoPlayWhenReady || userMutedRef.current) return;

    const timer = window.setTimeout(() => {
      void tryAutoPlay();
    }, AUTO_PLAY_DELAY_MS);

    const onFirstInteraction = () => {
      if (!userMutedRef.current && !audioRef.current) {
        void tryAutoPlay();
      }
    };

    document.addEventListener("pointerdown", onFirstInteraction, { once: true });

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("pointerdown", onFirstInteraction);
    };
  }, [autoPlayWhenReady, tryAutoPlay]);

  const toggle = async () => {
    if (busy) return;

    if (on) {
      userMutedRef.current = true;
      setBusy(true);
      const audio = audioRef.current;
      if (audio) {
        fadeVolume(audio, 0, () => {
          stopAudio();
          setOn(false);
          setBusy(false);
        });
      } else {
        setOn(false);
        setBusy(false);
      }
      return;
    }

    userMutedRef.current = false;
    setBusy(true);
    try {
      await startRecitation();
    } catch {
      stopAudio();
      setOn(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={on ? "Mute tilawat" : "Unmute tilawat (Surah Yaseen)"}
      aria-label={on ? "Mute Quran recitation" : "Unmute Quran recitation"}
      className="fixed bottom-5 right-5 z-50 size-12 rounded-full bg-card/80 backdrop-blur border border-border shadow-soft flex items-center justify-center text-gold hover:bg-card transition disabled:opacity-60"
    >
      {on ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
    </button>
  );
}
