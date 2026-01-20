"use client";

import { Plus, Sticker, Camera, Mic } from "lucide-react";
import { cn } from "@/lib/utils-cn";

export function WhatsAppIOSInputBar({ isDark }: { isDark: boolean }) {
  // =========================
  // TWEAKS (EDITA AQUÍ)
  // =========================
  const UI = {
    // Wrapper general del input bar (alto/padding)
    wrapPx: "px-3",
    wrapPy: "py-2", // prueba: "py-1.5" para más delgado

    // Layout horizontal
    rowGap: "gap-2", // prueba: "gap-1.5" o "gap-1"

    // Botones laterales (+, cámara, mic)
    sideBtnPadding: "p-0", // prueba: "p-1"
    plusSize: "h-5 w-5",
    camSize: "h-5 w-5",
    micSize: "h-5 w-5",

    // Pill
    pillH: "h-7", // prueba: "h-9.5" (si tu config soporta) o "h-9"
    pillPx: "px-2", // padding horizontal interno
    pillMinW: "min-w-0",
    pillFlex: "flex-1", // si quieres más largo todavía, deja esto y reduce gaps/padding

    // Sticker dentro del pill
    stickerSize: "h-5 w-5",
    stickerOpacity: "opacity-100",
    stickerMl: "ml-2", // separación del borde derecho
  } as const;

  // =========================
  // COLORS
  // =========================
  const iconColor = isDark ? "text-white/100" : "text-neutral-800";
  const pillBg = isDark ? "bg-white/10" : "bg-neutral-100/80";
  const pillBorder = isDark ? "border-white/10" : "border-neutral-200/70";
  const trailingIcon = isDark ? "text-white/70" : "text-neutral-700";

  return (
    <div className={cn(UI.wrapPx, UI.wrapPy)}>
      <div className={cn("flex items-center", UI.rowGap)}>
        {/* Plus */}
        <button
          className={cn(
            "shrink-0 rounded-full transition active:scale-[0.98]",
            UI.sideBtnPadding,
            iconColor
          )}
          aria-label="Plus"
          type="button"
        >
          <Plus className={cn(UI.plusSize)} />
        </button>

        {/* Pill */}
        <div
          className={cn(
            UI.pillFlex,
            UI.pillMinW,
            UI.pillH,
            UI.pillPx,
            "rounded-full border flex items-center",
            pillBg,
            pillBorder
          )}
        >
          {/* Sin label (como iOS) */}
          <span className="flex-1 min-w-0" />

          {/* Sticker */}
          <button
            className={cn(
              UI.stickerMl,
              "grid place-items-center shrink-0 rounded-full transition active:scale-[0.98]",
              trailingIcon
            )}
            aria-label="Sticker"
            type="button"
          >
            <Sticker className={cn(UI.stickerSize, UI.stickerOpacity)} />
          </button>
        </div>

        {/* Camera */}
        <button
          className={cn(
            "shrink-0 rounded-full transition active:scale-[0.98]",
            UI.sideBtnPadding,
            iconColor
          )}
          aria-label="Camera"
          type="button"
        >
          <Camera className={cn(UI.camSize)} />
        </button>

        {/* Mic */}
        <button
          className={cn(
            "shrink-0 rounded-full transition active:scale-[0.98]",
            UI.sideBtnPadding,
            iconColor
          )}
          aria-label="Mic"
          type="button"
        >
          <Mic className={cn(UI.micSize)} />
        </button>
      </div>
    </div>
  );
}
