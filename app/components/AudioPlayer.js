"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }

  function seek(e) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    audio.currentTime = value * (duration || 0);
    setCurrentTime(audio.currentTime);
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  function fmt(s) {
    const t = Math.floor(s || 0);
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const r = (t % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  }

  return (
    <div className="w-full max-w-md rounded-lg border bg-white dark:bg-black/20 p-3 shadow-sm">
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <button type="button" onClick={toggle} className="w-10 h-10 rounded-full bg-foreground text-background grid place-items-center">
          {isPlaying ? "❚❚" : "▶"}
        </button>
        <div className="flex-1">
          <input type="range" min={0} max={1} step={0.001} value={progress} onChange={seek} className="w-full accent-current" />
          <div className="flex justify-between text-xs mt-1 text-black/60 dark:text-white/60">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


