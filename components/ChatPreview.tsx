// components/ChatPreview.tsx
"use client";

import {
  ArrowLeft,
  Video,
  Phone,
  MoreVertical,
  Mic,
  CheckCheck,
  Plus,
  Camera,
  Sticker,
  Smile,
  Send,
  Paperclip,
  Image as ImageIcon,
  ThumbsUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils-cn";
import type { ChatMessage, Platform, Theme, OS } from "@/lib/types";

export function ChatPreview({
  platform,
  theme,
  os,
  contactName,
  messages,
  wallpaperUrl,
}: {
  platform: Platform;
  theme: Theme;
  os: OS;
  contactName: string;
  messages: ChatMessage[];
  wallpaperUrl?: string | null;
}) {
  const isWA = platform === "whatsapp";
  const isMS = platform === "messenger";
  const isDark = theme === "dark";
  const isIOS = os === "ios";

  // =========================
  // FRAME / HEADER STYLES
  // =========================
  const frameRadius = isIOS ? "rounded-[28px]" : "rounded-3xl";
  const border = isDark ? "border-white/10" : "border-neutral-200";

  // WhatsApp header
  const waHeaderBg = isDark ? "bg-[#202c33]" : "bg-white";
  const waHeaderText = isDark ? "text-white" : "text-neutral-900";
  const waHeaderSub = isDark ? "text-white/50" : "text-neutral-500";
  const waHeaderIcons = isDark
    ? "text-white/80 hover:bg-white/5"
    : "text-neutral-700 hover:bg-neutral-100";

  // ✅ Messenger header: SOLID (blanco/negro) + iconos azul Messenger
  const msHeaderBg = isDark ? "bg-black" : "bg-white";
  const msHeaderText = isDark ? "text-white" : "text-neutral-900";
  const msHeaderSub = isDark ? "text-white/70" : "text-neutral-700";
  const msIconBlue = isDark ? "text-[#4ea1ff]" : "text-[#1877f2]";

  const headerPad = isWA
    ? isIOS
      ? "px-3 py-2.5"
      : "px-3 py-3"
    : "px-3 py-3";

  // =========================
  // CANVAS BACKGROUNDS
  // =========================
  // Messenger = literal blanco/negro
  const msCanvasBg = isDark ? "bg-black" : "bg-white";

  // WhatsApp = color base + wallpaper opcional
  const waCanvasBg = isDark ? "bg-[#0b141a]" : "bg-[#eae6df]";

  const showWallpaper = isWA && !!wallpaperUrl;

  // Fondo default WhatsApp (sin doodles) cuando no hay wallpaper
  const waFallbackBg = (
    <>
      {isDark ? (
        <>
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(255,255,255,.10), transparent 35%), radial-gradient(circle at 90% 40%, rgba(255,255,255,.08), transparent 35%), radial-gradient(circle at 40% 90%, rgba(255,255,255,.07), transparent 35%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.55))]" />
        </>
      ) : (
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(0,0,0,.06), transparent 35%), radial-gradient(circle at 90% 40%, rgba(0,0,0,.05), transparent 35%)",
          }}
        />
      )}
    </>
  );

  // =========================
  // BUBBLES
  // =========================
  // WhatsApp bubbles
  const waThemBubble = isDark
    ? "bg-[#1f2c33] text-white/95"
    : "bg-white text-neutral-900";
  const waMeBubble = isDark
    ? "bg-[#005c4b] text-white"
    : "bg-[#d9fdd3] text-neutral-900";

  // Messenger bubbles (real-like)
  const msThemBubble = isDark
    ? "bg-[#2b2b2e] text-white/95"
    : "bg-[#e5e7eb] text-neutral-900";
  const msMeBubble = isDark
    ? "bg-[#1877f2] text-white"
    : "bg-[#1877f2] text-white";

  const bubbleRadiusMe = isIOS
    ? "rounded-[22px] rounded-tr-md"
    : "rounded-2xl rounded-tr-md";
  const bubbleRadiusThem = isIOS
    ? "rounded-[22px] rounded-tl-md"
    : "rounded-2xl rounded-tl-md";

  // =========================
  // HELPERS
  // =========================
  const initial = contactName?.[0]?.toUpperCase() || "A";

  return (
    <div className="w-full max-w-[430px] mx-auto" data-chat-root>
      <div
        className={cn(
          frameRadius,
          "overflow-hidden border shadow-[0_12px_50px_rgba(0,0,0,.25)]",
          border,
          isDark ? "bg-black" : "bg-white"
        )}
      >
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}
        <div
          className={cn(
            headerPad,
            "flex items-center gap-3",
            isWA ? waHeaderBg : msHeaderBg,
            isWA
              ? isDark
                ? ""
                : "border-b border-neutral-200"
              : // ✅ Messenger también trae border sutil en light
              isDark
              ? "border-b border-white/10"
              : "border-b border-neutral-200"
          )}
        >
          {/* Back */}
          <button
            className={cn(
              "p-2 -ml-1 rounded-full transition",
              isWA ? waHeaderIcons : "hover:bg-black/5 dark:hover:bg-white/10"
            )}
            aria-label="Back"
          >
            <ArrowLeft
              className={cn("h-5 w-5", isWA ? waHeaderText : msIconBlue)}
            />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold overflow-hidden",
                isWA
                  ? isDark
                    ? "bg-emerald-900/50 text-white/80"
                    : "bg-emerald-100 text-emerald-900"
                  : isDark
                  ? "bg-white/10 text-white/90"
                  : "bg-black/10 text-neutral-900"
              )}
            >
              {initial}
            </div>

            {/* Messenger green dot */}
            {isMS ? (
              <span
                className={cn(
                  "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border",
                  isDark
                    ? "bg-[#22c55e] border-black"
                    : "bg-[#22c55e] border-white"
                )}
              />
            ) : null}
          </div>

          {/* Name + sub */}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "font-medium truncate",
                isWA ? waHeaderText : msHeaderText
              )}
            >
              {contactName || "Contacto"}
            </div>
            <div
              className={cn(
                "text-[11px] truncate",
                isWA ? waHeaderSub : msHeaderSub
              )}
            >
              {isWA ? "en línea" : "Active now"}
            </div>
          </div>

          {/* Actions */}
          <div
            className={cn(
              "flex items-center gap-1",
              isWA ? waHeaderText : msHeaderText
            )}
          >
            {isWA ? (
              <>
                <button
                  className={cn(
                    "p-2 rounded-full transition",
                    waHeaderIcons
                  )}
                  aria-label="Video"
                >
                  <Video className="h-5 w-5" />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition",
                    waHeaderIcons
                  )}
                  aria-label="Call"
                >
                  <Phone className="h-5 w-5" />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition",
                    waHeaderIcons
                  )}
                  aria-label="More"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </>
            ) : (
              // ✅ Messenger: Phone, Video(Camera), Info (en ese orden)
              <>
                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Call"
                >
                  <Phone className={cn("h-5 w-5", msIconBlue)} />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Video"
                >
                  <Video className={cn("h-5 w-5", msIconBlue)} />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Info"
                >
                  <Info className={cn("h-5 w-5", msIconBlue)} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================= */}
        {/* CHAT AREA */}
        {/* ========================= */}
        <div
          data-chat-viewport
          className={cn(
            "relative h-[640px] sm:h-[700px] flex flex-col",
            isWA ? waCanvasBg : msCanvasBg
          )}
        >
          {/* ========================= */}
          {/* BACKGROUND LAYER (z-0) */}
          {/* ========================= */}
          <div className="absolute inset-0 z-0">
            {isWA ? (
              showWallpaper ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallpaperUrl!}
                    alt="Wallpaper"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* overlay para legibilidad */}
                  <div
                    className={cn(
                      "absolute inset-0",
                      isDark ? "bg-black/35" : "bg-white/20"
                    )}
                  />
                </>
              ) : (
                waFallbackBg
              )
            ) : null}
          </div>

          {/* ========================= */}
          {/* MESSAGES (z-10) */}
          {/* ========================= */}
          <div
            data-chat-scroll
            className={cn(
              "relative z-10 flex-1 overflow-y-auto px-3 py-4 space-y-2",
              isMS ? (isDark ? "bg-black" : "bg-white") : ""
            )}
          >
            {messages.map((m) => {
              const isMe = m.side === "me";

              const bubble = isWA
                ? isMe
                  ? waMeBubble
                  : waThemBubble
                : isMe
                ? msMeBubble
                : msThemBubble;

              const timeColor = isWA
                ? isDark
                  ? "text-white/60"
                  : "text-neutral-600"
                : isDark
                ? "text-white/60"
                : "text-neutral-750";

              return (
                <div
                  key={m.id}
                  className={cn("flex", isMe ? "justify-end" : "justify-start")}
                >
                  {/* Messenger: mostrar avatar pequeño a la izquierda (opcional, como screenshot real) */}
                  {isMS && !isMe ? (
                    <div className="mr-2 mt-1 shrink-0">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full grid place-items-center text-[11px] font-semibold",
                          isDark
                            ? "bg-white/10 text-white/90"
                            : "bg-black/10 text-neutral-900"
                        )}
                      >
                        {initial}
                      </div>
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      "max-w-[78%] px-3 py-2 text-[15px] leading-snug shadow-sm",
                      isMe ? bubbleRadiusMe : bubbleRadiusThem,
                      bubble,
                      isMS ? "rounded-2xl" : ""
                    )}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {m.text}
                    </div>

                    <div
                      className={cn(
                        "mt-1 flex items-center justify-end gap-1 text-[11px]",
                        timeColor
                      )}
                    >
                      <span>{m.time}</span>

                      {/* WhatsApp ticks */}
                      {isWA && isMe ? (
                        <span
                          className={cn(
                            "ml-1 inline-flex items-center",
                            m.status === "read"
                              ? isDark
                                ? "text-sky-300"
                                : "text-blue-600"
                              : isDark
                              ? "text-white/40"
                              : "text-neutral-400"
                          )}
                          aria-label="Status"
                        >
                          <CheckCheck className="h-4 w-4" />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer (arriba del input) */}
          <div
            className={cn(
              "pointer-events-none absolute z-20 bottom-[86px] left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-full border",
              isDark
                ? "text-white/35 bg-black/30 border-white/10"
                : "text-neutral-600 bg-white/80 border-neutral-200"
            )}
          >
            Simulated chat · Not real
          </div>

          {/* ========================= */}
          {/* INPUT BAR (z-20) */}
          {/* ========================= */}
          <div
            className={cn(
              "relative z-20 w-full border-t backdrop-blur",
              isWA
                ? isDark
                  ? "border-white/10 bg-[#0b141a]/95"
                  : "border-neutral-200 bg-white/90"
                : isDark
                ? "border-white/10 bg-black/90"
                : "border-neutral-200 bg-white/95"
            )}
          >
            {/* ============ WhatsApp ============ */}
            {isWA ? (
              <div className="px-3 py-3">
                {isIOS ? (
                  // WhatsApp iOS-like
                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center shrink-0",
                        isDark ? "text-white/90" : "text-neutral-800"
                      )}
                      aria-label="Plus"
                    >
                      <Plus className="h-7 w-7" />
                    </button>

                    <div
                      className={cn(
                        "flex-1 h-11 rounded-full border flex items-center gap-3 px-4 min-w-0",
                        isDark
                          ? "bg-white/10 border-white/10"
                          : "bg-neutral-50 border-neutral-200"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm truncate",
                          isDark ? "text-white/50" : "text-neutral-500"
                        )}
                      >
                        Message
                      </span>

                      <div className="ml-auto flex items-center gap-3 shrink-0">
                        <button
                          className={cn(
                            isDark ? "text-white/80" : "text-neutral-700"
                          )}
                          aria-label="Sticker"
                        >
                          <Sticker className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <button
                      className={cn(
                        "shrink-0",
                        isDark ? "text-white/90" : "text-neutral-800"
                      )}
                      aria-label="Camera"
                    >
                      <Camera className="h-7 w-7" />
                    </button>

                    <button
                      className={cn(
                        "shrink-0",
                        isDark ? "text-white/90" : "text-neutral-800"
                      )}
                      aria-label="Mic"
                    >
                      <Mic className="h-7 w-7" />
                    </button>
                  </div>
                ) : (
                  // WhatsApp Android-like (como tu screenshot real)
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex-1 h-12 rounded-full border flex items-center px-4 gap-3 min-w-0",
                        isDark
                          ? "bg-[#2a2f33]/90 border-white/10"
                          : "bg-neutral-50 border-neutral-200"
                      )}
                    >
                      <button
                        className={cn(
                          "shrink-0",
                          isDark ? "text-white/70" : "text-neutral-700"
                        )}
                        aria-label="Emoji"
                      >
                        <Smile className="h-6 w-6" />
                      </button>

                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-7 w-[3px] rounded-full bg-emerald-400/90" />
                        <span
                          className={cn(
                            "text-sm truncate",
                            isDark ? "text-white/50" : "text-neutral-500"
                          )}
                        >
                          Message
                        </span>
                      </div>

                      <div className="ml-auto flex items-center gap-4 shrink-0">
                        <button
                          className={cn(
                            isDark ? "text-white/70" : "text-neutral-700"
                          )}
                          aria-label="Attach"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>

                        <button
                          className={cn(
                            isDark ? "text-white/70" : "text-neutral-700"
                          )}
                          aria-label="Camera"
                        >
                          <Camera className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "h-12 w-12 rounded-full grid place-items-center shrink-0",
                        isDark ? "bg-[#00a884]" : "bg-[#25d366]"
                      )}
                      aria-hidden="true"
                    >
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // ============ Messenger ============
              // ✅ Orden: +, camera, image, mic | pill con "Message" + emoji (dentro, derecha) | like fuera, extremo derecho
              <div className="px-3 py-3">
                <div className="flex items-center gap-2">
                  {/* Left icons */}
                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Plus"
                  >
                    <Plus className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Camera"
                  >
                    <Camera className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Image"
                  >
                    <ImageIcon className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Mic"
                  >
                    <Mic className="h-6 w-6" />
                  </button>

                  {/* Pill input */}
                  <div
                    className={cn(
                      "flex-1 h-10 rounded-full px-4 flex items-center min-w-[150px] gap-3",
                      isDark ? "bg-[#1f1f1f]" : "bg-[#f0f2f5]"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm truncate",
                        isDark ? "text-white/60" : "text-neutral-600"
                      )}
                    >
                      Message
                    </span>

                    {/* Emoji INSIDE pill, right side */}
                    <button
                      className={cn(
                        "ml-auto grid place-items-center shrink-0",
                        isDark ? "text-white/60" : "text-neutral-600"
                      )}
                      aria-label="Emoji"
                    >
                      <Smile className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Like OUTSIDE pill, far right */}
                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Like"
                  >
                    <ThumbsUp className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
