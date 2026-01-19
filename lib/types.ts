// lib/types.ts
export type Platform = "whatsapp" | "messenger";
export type Theme = "dark" | "light";
export type OS = "android" | "ios";

export type ChatMessage = {
  id: string;
  side: "me" | "them";
  text: string;
  time: string; // "2:04 pm"
  status?: "sent" | "delivered" | "read"; // solo para "me"
};

// ✅ NUEVO: wallpaper (solo lo usaremos en WhatsApp)
export type WallpaperUrl = string | null;
