// lib/types.ts

export type Platform = "whatsapp" | "messenger";
export type Theme = "dark" | "light";
export type OS = "android" | "ios";

/**
 * Mensaje de chat (texto o audio)
 * - Si `type` no existe, se asume "text" (compatibilidad hacia atrás)
 */
export type ChatMessage = {
  id: string;
  side: "me" | "them";
  time: string; // ej. "2:04 pm"

  // 🔹 Tipo de mensaje (nuevo, opcional para no romper lo existente)
  type?: "text" | "audio";

  // 🔹 TEXTO
  text?: string;

  // 🔹 ESTADO (solo WhatsApp y solo para "me")
  status?: "sent" | "delivered" | "read";

  // 🔹 AUDIO (solo si type === "audio")
  durationSec?: number;     // duración total en segundos (ej. 12, 75)
  isPlayed?: boolean;       // opcional (para UI: punto azul / estado)
  waveformSeed?: number;    // opcional (para simular barras de audio)
};

// ✅ Wallpaper (solo WhatsApp)
export type WallpaperUrl = string | null;
