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
  Smile,
  Paperclip,
  Image as ImageIcon,
  ThumbsUp,
  Info,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils-cn";
import type { ChatMessage, Platform, Theme, OS } from "@/lib/types";

import { WhatsAppAudioBubble } from "@/components/WhatsAppAudioBubble";
import { MessengerAudioBubble } from "@/components/MessengerAudioBubble";
import { WhatsAppIOSInputBar } from "@/components/WhatsAppIOSInputBar";

export function ChatPreview({
  platform,
  theme,
  os,
  contactName,
  messages,
  wallpaperUrl,
  // ✅ NUEVO (opcionales)
  contactAvatarUrl,
  meAvatarUrl,
}: {
  platform: Platform;
  theme: Theme;
  os: OS;
  contactName: string;
  messages: ChatMessage[];
  wallpaperUrl?: string | null;
  contactAvatarUrl?: string | null;
  meAvatarUrl?: string | null;
}) {
  const isWA = platform === "whatsapp";
  const isMS = platform === "messenger";
  const isDark = theme === "dark";
  const isIOS = os === "ios";

  // =========================================================
  // ✅ VARIABLES EDITABLES — SOLO APLICAN CUANDO isWA && isIOS
  // =========================================================
  const IOS_TWEAKS = {
    // 1) Width del contenedor principal SOLO para WhatsApp iOS
    rootMaxW: "max-w-full sm:max-w-[600px]", // prueba 480, 500, 540, etc.

    // 2) Alto total del viewport (opcional)
    // viewportH: "h-[640px] sm:h-[700px]",
    viewportH: "h-[640px] sm:h-[700px]",

    // 3) Padding del área de mensajes (para que “respire”)
    scrollPx: "px-3", // antes px-3
    scrollPy: "py-4", // antes py-4
    scrollGap: "space-y-2",

    // 4) Ajuste fino del “footer” donde vive el input (solo iOS WA)
    //    (sin romper otros OS / plataformas)
    inputWrap: "px-0 py-0", // si quieres aire: "px-2 py-1"
  } as const;

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

  // Messenger header
  const msHeaderBg = isDark ? "bg-black" : "bg-white";
  const msHeaderText = isDark ? "text-white" : "text-neutral-900";
  const msHeaderSub = isDark ? "text-white/70" : "text-neutral-700";
  const msIconBlue = isDark ? "text-[#4ea1ff]" : "text-[#1877f2]";

  const headerPad = isWA ? (isIOS ? "px-3 py-2.5" : "px-3 py-3") : "px-3 py-3";

  // =========================
  // CANVAS BACKGROUNDS
  // =========================
  const msCanvasBg = isDark ? "bg-black" : "bg-white";
  const waCanvasBg = isDark ? "bg-[#0b141a]" : "bg-[#eae6df]";

  const showWallpaper = isWA && !!wallpaperUrl;

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
  const waThemBubble = isDark
    ? "bg-[#1f2c33] text-white/95"
    : "bg-white text-neutral-900";
  const waMeBubble = isDark
    ? "bg-[#005c4b] text-white"
    : "bg-[#d9fdd3] text-neutral-900";

  const msThemBubble = isDark
    ? "bg-[#2b2b2e] text-white/95"
    : "bg-[#e5e7eb] text-neutral-900";
  const msMeBubble = "bg-[#1877f2] text-white";

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

  // ✅ rootClass: variables SOLO para WA+iOS
  const rootClass = cn(
    "w-full mx-auto min-w-0",
    isWA && isIOS
      ? IOS_TWEAKS.rootMaxW
      : isMS
      ? "max-w-full sm:max-w-[430px]"
      : "max-w-[430px]"
  );

  function formatDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // seed simple para waveform “estable”
  function hashToInt(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  function buildWaveBars(seed: number, count = 28) {
    const bars = [];
    let x = seed || 1;
    for (let i = 0; i < count; i++) {
      x = (x * 1664525 + 1013904223) >>> 0;
      const v = 6 + (x % 13);
      bars.push(v);
    }
    return bars;
  }

  return (
    <div className={rootClass} data-chat-root>
      <div
        className={cn(
          frameRadius,
          "w-full overflow-hidden border shadow-[0_12px_50px_rgba(0,0,0,.25)]",
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
              : isDark
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
            type="button"
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
              {/* ✅ NUEVO: si hay avatarUrl del contacto, úsalo */}
              {isWA && contactAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contactAvatarUrl}
                  alt="Contact avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
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
                  className={cn("p-2 rounded-full transition", waHeaderIcons)}
                  aria-label="Video"
                  type="button"
                >
                  <Video className="h-5 w-5" />
                </button>
                <button
                  className={cn("p-2 rounded-full transition", waHeaderIcons)}
                  aria-label="Call"
                  type="button"
                >
                  <Phone className="h-5 w-5" />
                </button>
                <button
                  className={cn("p-2 rounded-full transition", waHeaderIcons)}
                  aria-label="More"
                  type="button"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Call"
                  type="button"
                >
                  <Phone className={cn("h-5 w-5", msIconBlue)} />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Video"
                  type="button"
                >
                  <Video className={cn("h-5 w-5", msIconBlue)} />
                </button>

                <button
                  className={cn(
                    "p-2 rounded-full transition hover:bg-black/5 dark:hover:bg-white/10"
                  )}
                  aria-label="Info"
                  type="button"
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
            "relative flex flex-col",
            isWA && isIOS ? IOS_TWEAKS.viewportH : "h-[640px] sm:h-[700px]",
            isWA ? waCanvasBg : msCanvasBg
          )}
        >
          {/* BACKGROUND */}
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

          {/* MESSAGES */}
          <div
            data-chat-scroll
            className={cn(
              "relative z-10 flex-1 overflow-y-auto",
              isWA && isIOS
                ? cn(
                    IOS_TWEAKS.scrollPx,
                    IOS_TWEAKS.scrollPy,
                    IOS_TWEAKS.scrollGap
                  )
                : "px-3 py-4 space-y-2",
              isMS ? (isDark ? "bg-black" : "bg-white") : ""
            )}
          >
            {messages.map((m) => {
              const isMe = m.side === "me";
              const type = (m as any).type ?? "text";
              const durationSec = (m as any).durationSec ?? 0;

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
                : "text-neutral-700";

              const showUnplayedDot =
                !isMe &&
                ((m as any).isPlayed === false ||
                  (m as any).isPlayed === undefined);

              const seed = (m as any).waveformSeed ?? hashToInt(m.id);

              // pads / width especiales para audios
              const bubblePad =
                type === "audio" && (isWA || isMS) ? "px-0 py-0" : "px-3 py-2";
              const bubbleMaxW =
                type === "audio" && (isWA || isMS)
                  ? "max-w-[88%]"
                  : "max-w-[78%]";

              return (
                <div
                  key={m.id}
                  className={cn("flex", isMe ? "justify-end" : "justify-start")}
                >
                  {/* Messenger avatar se queda igual (no tocar) */}
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
                      bubbleMaxW,
                      "text-[15px] leading-snug shadow-sm",
                      bubblePad,
                      isMe ? bubbleRadiusMe : bubbleRadiusThem,
                      bubble
                    )}
                  >
                    {/* WhatsApp audio */}
                    {type === "audio" && isWA ? (
                      <WhatsAppAudioBubble
                        isMe={isMe}
                        isDark={isDark}
                        initial={isMe ? "A" : initial}
                        durationSec={durationSec || 1}
                        time={m.time}
                        status={(m as any).status}
                        showUnplayedDot={showUnplayedDot}
                        // ✅ NUEVO: avatar por lado
                        avatarUrl={isMe ? meAvatarUrl ?? null : contactAvatarUrl ?? null}
                      />
                    ) : type === "audio" && isMS ? (
                      /* Messenger audio */
                      <MessengerAudioBubble
                        isMe={isMe}
                        isDark={isDark}
                        durationSec={durationSec || 5}
                        waveformSeed={(m as any).waveformSeed ?? seed}
                      />
                    ) : type === "audio" ? (
                      // genérico
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label="Play"
                            className={cn(
                              "h-9 w-9 rounded-full grid place-items-center shrink-0",
                              isMe
                                ? "bg-white/15"
                                : isDark
                                ? "bg-white/10"
                                : "bg-black/10"
                            )}
                          >
                            <Play
                              className={cn(
                                "h-5 w-5",
                                isMe
                                  ? "text-white"
                                  : isDark
                                  ? "text-white/90"
                                  : "text-neutral-800"
                              )}
                            />
                          </button>

                          <div className="flex-1 min-w-[140px]">
                            <div className="flex items-end gap-[2px] h-5">
                              {buildWaveBars(seed, 18).map((h, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    "w-[3px] rounded-full",
                                    isMe
                                      ? "bg-white/85"
                                      : isDark
                                      ? "bg-white/40"
                                      : "bg-black/25"
                                  )}
                                  style={{ height: `${h}px` }}
                                />
                              ))}
                            </div>
                            <div
                              className={cn(
                                "mt-1 text-[11px]",
                                isMe
                                  ? "text-white/80"
                                  : isDark
                                  ? "text-white/60"
                                  : "text-neutral-600"
                              )}
                            >
                              {formatDuration(durationSec || 12)}
                            </div>
                          </div>

                          <Mic
                            className={cn(
                              "h-5 w-5 shrink-0",
                              isMe
                                ? "text-white/80"
                                : isDark
                                ? "text-white/60"
                                : "text-neutral-600"
                            )}
                          />
                        </div>

                        <div
                          className={cn(
                            "mt-1 flex items-center justify-end gap-1 text-[11px]",
                            timeColor
                          )}
                        >
                          <span>{m.time}</span>
                        </div>
                      </div>
                    ) : (
                      <>
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

                          {isWA && isMe ? (
                            <span
                              className={cn(
                                "ml-1 inline-flex items-center",
                                (m as any).status === "read"
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
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Disclaimer */}
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

          {/* INPUT BAR */}
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
            {isWA ? (
              isIOS ? (
                // ✅ SOLO iOS WA: control extra de padding externo
                <div className={IOS_TWEAKS.inputWrap}>
                  <WhatsAppIOSInputBar isDark={isDark} />
                </div>
              ) : (
                // Android WA igual
                <div className="px-3 py-3">
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
                        type="button"
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
                          type="button"
                        >
                          <Paperclip className="h-6 w-6" />
                        </button>

                        <button
                          className={cn(
                            isDark ? "text-white/70" : "text-neutral-700"
                          )}
                          aria-label="Camera"
                          type="button"
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
                </div>
              )
            ) : (
              // Messenger igual
              <div className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Plus"
                    type="button"
                  >
                    <Plus className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Camera"
                    type="button"
                  >
                    <Camera className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Image"
                    type="button"
                  >
                    <ImageIcon className="h-6 w-6" />
                  </button>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Mic"
                    type="button"
                  >
                    <Mic className="h-6 w-6" />
                  </button>

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

                    <button
                      className={cn(
                        "ml-auto grid place-items-center shrink-0",
                        isDark ? "text-white/60" : "text-neutral-600"
                      )}
                      aria-label="Emoji"
                      type="button"
                    >
                      <Smile className="h-6 w-6" />
                    </button>
                  </div>

                  <button
                    className={cn(
                      "h-10 w-10 rounded-full grid place-items-center shrink-0",
                      msIconBlue
                    )}
                    aria-label="Like"
                    type="button"
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
