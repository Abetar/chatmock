// components/MessageComposer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils-cn";

function nowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  const hr12 = ((h + 11) % 12) + 1;
  return `${hr12}:${m} ${ampm}`;
}

/**
 * Acepta:
 * - "75" (segundos)
 * - "1:15" (mm:ss)
 * Devuelve segundos o null si inválido.
 */
function parseDurationToSec(input: string): number | null {
  const v = input.trim();
  if (!v) return null;

  // Solo segundos: "75"
  if (/^\d+$/.test(v)) {
    const sec = Number(v);
    if (!Number.isFinite(sec) || sec <= 0) return null;
    return sec;
  }

  // mm:ss (permite m >= 0, ss 00-59)
  const m = v.match(/^(\d+):([0-5]\d)$/);
  if (!m) return null;
  const minutes = Number(m[1]);
  const seconds = Number(m[2]);
  const total = minutes * 60 + seconds;
  if (!Number.isFinite(total) || total <= 0) return null;
  return total;
}

type AvatarsPayload = {
  contactAvatarUrl: string;
  meAvatarUrl: string;
};

export function MessageComposer({
  onAdd,
  onAvatarsChange,
  initialContactAvatarUrl = "",
  initialMeAvatarUrl = "",
}: {
  onAdd: (msg: ChatMessage) => void;

  // ✅ nuevo (opcional): para que el padre guarde y se lo pase a ChatPreview
  onAvatarsChange?: (v: AvatarsPayload) => void;

  // ✅ nuevo (opcional): por si quieres persistir valores al cambiar plataforma/tema/etc.
  initialContactAvatarUrl?: string;
  initialMeAvatarUrl?: string;
}) {
  const [side, setSide] = useState<"me" | "them">("me");

  // ✅ nuevo: modo
  const [mode, setMode] = useState<"text" | "audio">("text");

  // Text
  const [text, setText] = useState("");

  // Audio
  const [duration, setDuration] = useState("0:12"); // default útil

  // Shared
  const [time, setTime] = useState(nowTime());

  // ✅ nuevo: avatares (WhatsApp)
  const [contactAvatarUrl, setContactAvatarUrl] = useState(initialContactAvatarUrl);
  const [meAvatarUrl, setMeAvatarUrl] = useState(initialMeAvatarUrl);

  // ✅ informar al padre si existe callback
  useEffect(() => {
    onAvatarsChange?.({
      contactAvatarUrl: contactAvatarUrl.trim(),
      meAvatarUrl: meAvatarUrl.trim(),
    });
  }, [contactAvatarUrl, meAvatarUrl, onAvatarsChange]);

  const durationSec = useMemo(
    () => (mode === "audio" ? parseDurationToSec(duration) : null),
    [mode, duration]
  );

  const canAdd = useMemo(() => {
    if (mode === "text") return text.trim().length > 0;
    return durationSec !== null;
  }, [mode, text, durationSec]);

  return (
    <div className="space-y-3">
      {/* Side */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide("me")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            side === "me"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border-white/10 text-white/70"
          )}
          type="button"
        >
          Yo (derecha)
        </button>
        <button
          onClick={() => setSide("them")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            side === "them"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border border-white/10 text-white/70"
          )}
          type="button"
        >
          Otra persona (izquierda)
        </button>
      </div>

      {/* Mode: Text / Audio */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode("text")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            mode === "text"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border-white/10 text-white/70"
          )}
          type="button"
        >
          Texto
        </button>
        <button
          onClick={() => setMode("audio")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            mode === "audio"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border-white/10 text-white/70"
          )}
          type="button"
        >
          Nota de voz
        </button>
      </div>

      {/* Body */}
      {mode === "text" ? (
        <label className="block">
          <span className="text-xs text-white/60">Mensaje</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Escribe el texto…"
            className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/25"
          />
        </label>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div>
            <div className="text-sm font-medium">Nota de voz</div>
            <div className="text-xs text-white/55">
              Duración: escribe <span className="font-semibold">segundos</span> (ej. 75) o{" "}
              <span className="font-semibold">mm:ss</span> (ej. 1:15)
            </div>
          </div>

          <label className="block">
            <span className="text-xs text-white/60">Duración</span>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="0:12"
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/25"
            />
            {duration.trim().length > 0 && durationSec === null ? (
              <div className="mt-1 text-[11px] text-rose-300/90">
                Formato inválido. Usa 75 o 1:15
              </div>
            ) : null}
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDuration("0:07")}
              className="rounded-xl bg-white/10 border border-white/10 text-white/80 px-3 py-2 hover:bg-white/15 text-sm"
            >
              0:07
            </button>
            <button
              type="button"
              onClick={() => setDuration("0:12")}
              className="rounded-xl bg-white/10 border border-white/10 text-white/80 px-3 py-2 hover:bg-white/15 text-sm"
            >
              0:12
            </button>
            <button
              type="button"
              onClick={() => setDuration("1:05")}
              className="rounded-xl bg-white/10 border border-white/10 text-white/80 px-3 py-2 hover:bg-white/15 text-sm"
            >
              1:05
            </button>
          </div>
        </div>
      )}

      {/* Time */}
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs text-white/60">Hora</span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/25"
          />
        </label>

        <button
          onClick={() => setTime(nowTime())}
          className="mt-6 rounded-xl bg-white/10 border border-white/10 text-white/80 px-3 py-2 hover:bg-white/15"
          type="button"
        >
          Hora actual
        </button>
      </div>

      {/* ✅ Avatars (WhatsApp) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div>
          <div className="text-sm font-medium">Avatares (WhatsApp)</div>
          <div className="text-xs text-white/55">
            Pega una URL (png/jpg/webp). Se usará en el header y en audios.
          </div>
        </div>

        <label className="block">
          <span className="text-xs text-white/60">Avatar contacto (Benito / izquierda)</span>
          <input
            value={contactAvatarUrl}
            onChange={(e) => setContactAvatarUrl(e.target.value)}
            placeholder="https://.../benito.png"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/25"
          />
        </label>

        <label className="block">
          <span className="text-xs text-white/60">Avatar yo (derecha)</span>
          <input
            value={meAvatarUrl}
            onChange={(e) => setMeAvatarUrl(e.target.value)}
            placeholder="https://.../yo.png"
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/25"
          />
        </label>
      </div>

      {/* Add */}
      <button
        disabled={!canAdd}
        onClick={() => {
          const base: ChatMessage = {
            id: crypto.randomUUID(),
            side,
            time: time.trim() || nowTime(),
            status: side === "me" ? "read" : undefined,
          };

          const msg: ChatMessage =
            mode === "text"
              ? {
                  ...base,
                  type: "text",
                  text: text.trim(),
                }
              : {
                  ...base,
                  type: "audio",
                  durationSec: durationSec ?? 12,
                  // opcional: semilla para barras “consistentes” por mensaje
                  waveformSeed: Math.floor(Math.random() * 1000000),
                  // opcional: estado inicial
                  isPlayed: side === "me" ? true : false,
                };

          onAdd(msg);

          // reset campos
          if (mode === "text") setText("");
          // en audio dejamos duración como está (más cómodo para agregar varias)
        }}
        className={cn(
          "w-full rounded-2xl py-3 font-medium",
          canAdd
            ? "bg-emerald-500/90 hover:bg-emerald-500 text-black"
            : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
        )}
        type="button"
      >
        {mode === "text" ? "Agregar mensaje" : "Agregar nota de voz"}
      </button>

      <p className="text-[11px] text-white/45 leading-snug">
        Recomendado: mantener un watermark/disclaimer para evitar mal uso y para que Ads no te rechace.
      </p>
    </div>
  );
}
