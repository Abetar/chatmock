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

function safeId() {
  // ✅ Si existe randomUUID, úsalo
  const c = globalThis.crypto as Crypto | undefined;
  if (c && "randomUUID" in c && typeof (c as any).randomUUID === "function") {
    return (c as any).randomUUID() as string;
  }

  // ✅ Fallback: id suficientemente único para tu app (client-side)
  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

type AvatarsPayload = {
  contactAvatarUrl: string;
  meAvatarUrl: string;
};

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(blob);
  });
}

function isHeicLike(file: File) {
  const t = (file.type || "").toLowerCase();
  const n = (file.name || "").toLowerCase();
  return (
    t.includes("heic") ||
    t.includes("heif") ||
    n.endsWith(".heic") ||
    n.endsWith(".heif")
  );
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
  const [time, setTime] = useState("");

useEffect(() => {
  setTime(nowTime());
}, []);

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

  async function convertHeicToPngBlob(file: File): Promise<Blob> {
    // ✅ Import dinámico (evita "window is not defined")
    const mod: any = await import("heic2any");
    const heic2any = mod?.default ?? mod;

    const out: Blob | Blob[] = await heic2any({
      blob: file,
      toType: "image/png",
      quality: 0.95,
    });

    return Array.isArray(out) ? out[0] : out;
  }

  async function onPickAvatar(
    file: File | null,
    who: "contact" | "me"
  ): Promise<void> {
    if (!file) return;

    if (who === "contact") setContactAvatarErr("");
    else setMeAvatarErr("");

    // tamaño base del archivo original
    if (file.size > MAX_AVATAR_BYTES) {
      const msg = `Máximo ${MAX_AVATAR_MB}MB.`;
      who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
      return;
    }

    try {
      let dataUrl = "";

      // ✅ Si es HEIC/HEIF: convertir a PNG para que html-to-image lo pinte en iOS
      if (isHeicLike(file)) {
        const pngBlob = await convertHeicToPngBlob(file);

        // Ojo: la conversión puede aumentar tamaño
        if (pngBlob.size > MAX_AVATAR_BYTES) {
          const msg = `La imagen convertida es muy pesada. Máximo ${MAX_AVATAR_MB}MB.`;
          who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
          return;
        }

        dataUrl = await readBlobAsDataUrl(pngBlob);
      } else {
        // ✅ Para jpg/png/webp normales
        if (!file.type.startsWith("image/")) {
          const msg = "Archivo inválido. Usa png/jpg/webp (o heic desde iPhone).";
          who === "contact" ? setContactAvatarErr(msg) : setMeAvatarErr(msg);
          return;
        }
        dataUrl = await readBlobAsDataUrl(file);
      }

      if (!dataUrl) throw new Error("DataURL vacío.");

      who === "contact" ? setContactAvatarUrl(dataUrl) : setMeAvatarUrl(dataUrl);
    } catch (err) {
      const msg =
        isHeicLike(file)
          ? "No se pudo convertir HEIC. Intenta con otra imagen o desactiva HEIC en iPhone (Ajustes > Cámara > Formatos > Más compatible)."
          : "No se pudo cargar la imagen.";
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
            placeholder="0:12 ó 75"
          />
          {duration.trim().length > 0 && durationSec === null ? (
            <div className="mt-1 text-[11px] text-rose-300/90">
              Formato inválido. Usa 75 o 1:15
            </div>
          ) : null}
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
        <div className="text-xs text-white/50">
          iPhone sube HEIC por defecto: lo convertimos a PNG para que exporte bien.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Contact */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10">
                {contactAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={contactAvatarUrl}
                    className="h-full w-full object-cover"
                    alt="Avatar contacto"
                    loading="eager"
                    decoding="sync"
                  />
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
                  accept="image/*,.heic,.heif"
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
                  <img
                    src={meAvatarUrl}
                    className="h-full w-full object-cover"
                    alt="Avatar yo"
                    loading="eager"
                    decoding="sync"
                  />
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
                  accept="image/*,.heic,.heif"
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
          // (Tu error de crypto.randomUUID ya lo tienes resuelto usando crypto.randomUUID/UUID)
          const base: ChatMessage = {
            id: safeId(),
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
