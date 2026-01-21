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

  if (/^\d+$/.test(v)) {
    const sec = Number(v);
    if (!Number.isFinite(sec) || sec <= 0) return null;
    return sec;
  }

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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

const MAX_AVATAR_MB = 5;
const MAX_AVATAR_BYTES = MAX_AVATAR_MB * 1024 * 1024;

export function MessageComposer({
  onAdd,
  onAvatarsChange,
  initialContactAvatarUrl = "",
  initialMeAvatarUrl = "",
}: {
  onAdd: (msg: ChatMessage) => void;
  onAvatarsChange?: (v: AvatarsPayload) => void;
  initialContactAvatarUrl?: string;
  initialMeAvatarUrl?: string;
}) {
  const [side, setSide] = useState<"me" | "them">("me");
  const [mode, setMode] = useState<"text" | "audio">("text");

  const [text, setText] = useState("");
  const [duration, setDuration] = useState("0:12");
  const [time, setTime] = useState(nowTime());

  const [contactAvatarUrl, setContactAvatarUrl] = useState(
    initialContactAvatarUrl
  );
  const [meAvatarUrl, setMeAvatarUrl] = useState(initialMeAvatarUrl);

  const [contactAvatarErr, setContactAvatarErr] = useState("");
  const [meAvatarErr, setMeAvatarErr] = useState("");

  useEffect(() => {
    onAvatarsChange?.({
      contactAvatarUrl: contactAvatarUrl || "",
      meAvatarUrl: meAvatarUrl || "",
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

  async function onPickAvatar(
    file: File | null,
    who: "contact" | "me"
  ): Promise<void> {
    if (!file) return;

    if (who === "contact") setContactAvatarErr("");
    else setMeAvatarErr("");

    if (!file.type.startsWith("image/")) {
      const msg = "Archivo inválido. Usa png/jpg/webp.";
      who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      const msg = `Máximo ${MAX_AVATAR_MB}MB.`;
      who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      who === "contact"
        ? setContactAvatarUrl(dataUrl)
        : setMeAvatarUrl(dataUrl);
    } catch {
      const msg = "No se pudo cargar la imagen.";
      who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
    }
  }

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
              : "bg-white/5 border-white/10 text-white/70"
          )}
          type="button"
        >
          Otra persona (izquierda)
        </button>
      </div>

      {/* Mode */}
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
            className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/25"
          />
        </label>
      ) : (
        <label className="block">
          <span className="text-xs text-white/60">Duración</span>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
          />
        </label>
      )}

      {/* Time */}
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs text-white/60">Hora</span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none"
          />
        </label>
        <button
          onClick={() => setTime(nowTime())}
          className="mt-6 rounded-xl bg-white/10 border border-white/10 px-3 py-2"
          type="button"
        >
          Hora actual
        </button>
      </div>

      {/* Avatars */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="text-sm font-medium">Avatares (WhatsApp)</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                {contactAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={contactAvatarUrl} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/40 text-xs">
                    ?
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 bg-white/10 border border-white/10 hover:bg-white/15 text-xs">
                <span className="h-7 w-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                  +
                </span>
                Subir
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    onPickAvatar(e.target.files?.[0] ?? null, "contact");
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            {contactAvatarErr && (
              <div className="text-[11px] text-rose-300">{contactAvatarErr}</div>
            )}
          </div>

          {/* Me */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                {meAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={meAvatarUrl} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/40 text-xs">
                    Me
                  </div>
                )}
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl px-3 py-2 bg-white/10 border border-white/10 hover:bg-white/15 text-xs">
                <span className="h-7 w-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                  +
                </span>
                Subir
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    onPickAvatar(e.target.files?.[0] ?? null, "me");
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
            {meAvatarErr && (
              <div className="text-[11px] text-rose-300">{meAvatarErr}</div>
            )}
          </div>
        </div>
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
              ? { ...base, type: "text", text: text.trim() }
              : {
                  ...base,
                  type: "audio",
                  durationSec: durationSec ?? 12,
                  waveformSeed: Math.floor(Math.random() * 1_000_000),
                  isPlayed: side === "me",
                };

          onAdd(msg);
          if (mode === "text") setText("");
        }}
        className={cn(
          "w-full rounded-2xl py-3 font-medium",
          canAdd
            ? "bg-emerald-500 text-black hover:bg-emerald-400"
            : "bg-white/5 text-white/30 border border-white/10"
        )}
        type="button"
      >
        {mode === "text" ? "Agregar mensaje" : "Agregar nota de voz"}
      </button>
    </div>
  );
}
