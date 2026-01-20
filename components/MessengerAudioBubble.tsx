"use client";

import { Play } from "lucide-react";
import { cn } from "@/lib/utils-cn";

export function MessengerAudioBubble({
  isMe,
  isDark,
  durationSec,
  waveformSeed,
}: {
  isMe: boolean;
  isDark: boolean;
  durationSec: number;
  waveformSeed?: number;
}) {
  function formatDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function buildWaveBars(seed: number, count = 26) {
    const bars: number[] = [];
    let x = seed || 1;
    for (let i = 0; i < count; i++) {
      x = (x * 1664525 + 1013904223) >>> 0;
      // alturas tipo “puntitos/barras” pequeñas
      bars.push(6 + (x % 11)); // 6..16
    }
    return bars;
  }

  const bars = buildWaveBars(waveformSeed ?? 12345, 26);

  const playColor = isMe
    ? "text-white"
    : isDark
    ? "text-white/85"
    : "text-neutral-800";

  const barColor = isMe ? "bg-white/85" : isDark ? "bg-white/55" : "bg-black/30";

  const durColor = isMe
    ? "text-white/85"
    : isDark
    ? "text-white/80"
    : "text-neutral-800/75";

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-3 p-2">
        {/* Play izquierda (sin círculo como el original) */}
        <button type="button" aria-label="Play" className="shrink-0">
          <Play className={cn("h-5 w-5", playColor)} />
        </button>

        {/* Waveform al centro */}
        <div className="flex-1 min-w-[150px]">
          <div className="flex items-center gap-[4px] h-5">
            {bars.map((h, idx) => (
              <span
                key={idx}
                className={cn("w-[2px] rounded-full", barColor)}
                style={{ height: `${h}px` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Duración derecha */}
        <div className={cn("text-[12px] tabular-nums shrink-0", durColor)}>
          {formatDuration(durationSec || 5)}
        </div>
      </div>
    </div>
  );
}
