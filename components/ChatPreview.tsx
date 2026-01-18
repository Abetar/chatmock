// components/ChatPreview.tsx
"use client";

import {
  ArrowLeft,
  Video,
  Phone,
  MoreVertical,
  Mic,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils-cn";
import type { ChatMessage, Platform, Theme } from "@/lib/types";

export function ChatPreview({
  platform,
  theme,
  contactName,
  messages,
}: {
  platform: Platform;
  theme: Theme;
  contactName: string;
  messages: ChatMessage[];
}) {
  const isWA = platform === "whatsapp";
  const isDark = theme === "dark";

  // Paletas (inspiradas, no oficiales)
  const headerBg = isDark
    ? isWA
      ? "bg-[#202c33]"
      : "bg-[#1b1f27]"
    : "bg-white";
  const headerText = isDark ? "text-white" : "text-neutral-900";
  const headerSub = isDark ? "text-white/50" : "text-neutral-500";
  const headerIcons = isDark
    ? "text-white/80 hover:bg-white/5"
    : "text-neutral-700 hover:bg-neutral-100";

  const canvasBg = isDark ? "bg-[#0b141a]" : "bg-[#eae6df]";
  const border = isDark ? "border-white/10" : "border-neutral-200";

  const themBubble = isDark
    ? "bg-[#1f2c33] text-white/95"
    : "bg-white text-neutral-900";
  const meBubbleWA = isDark
    ? "bg-[#005c4b] text-white"
    : "bg-[#d9fdd3] text-neutral-900";
  const meBubbleMS = isDark
    ? "bg-[#1f6fff] text-white"
    : "bg-[#0b5cff] text-white";

  return (
    <div className="w-full max-w-[430px] mx-auto" data-chat-root>
      <div
        className={cn(
          "rounded-3xl overflow-hidden border shadow-[0_12px_50px_rgba(0,0,0,.25)]",
          border,
          isDark ? "bg-black" : "bg-white"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "px-3 py-3 flex items-center gap-3",
            headerBg,
            isDark ? "" : "border-b border-neutral-200"
          )}
        >
          <button
            className={cn("p-2 -ml-1 rounded-full transition", headerIcons)}
            aria-label="Back"
          >
            <ArrowLeft className={cn("h-5 w-5", headerText)} />
          </button>

          <div
            className={cn(
              "h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold",
              isDark
                ? "bg-emerald-900/50 text-white/80"
                : "bg-emerald-100 text-emerald-900"
            )}
          >
            {contactName?.[0]?.toUpperCase() || "A"}
          </div>

          <div className="flex-1 min-w-0">
            <div className={cn("font-medium truncate", headerText)}>
              {contactName || "Contacto"}
            </div>
            <div className={cn("text-[11px] truncate", headerSub)}>
              {isWA ? "en línea" : "Activo ahora"}
            </div>
          </div>

          <div className={cn("flex items-center gap-1", headerText)}>
            <button
              className={cn("p-2 rounded-full transition", headerIcons)}
              aria-label="Video"
            >
              <Video className="h-5 w-5" />
            </button>

            <button
              className={cn("p-2 rounded-full transition", headerIcons)}
              aria-label="Call"
            >
              <Phone className="h-5 w-5" />
            </button>

            <button
              className={cn("p-2 rounded-full transition", headerIcons)}
              aria-label="More"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div
          data-chat-viewport
          className={cn(
            "relative h-[640px] sm:h-[700px] flex flex-col",
            canvasBg
          )}
        >
          {/* Wallpaper */}
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
              className="absolute inset-0 opacity-[0.25]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 10%, rgba(0,0,0,.06), transparent 35%), radial-gradient(circle at 90% 40%, rgba(0,0,0,.05), transparent 35%)",
              }}
            />
          )}

          {/* Messages */}
          <div
            data-chat-scroll
            className="relative flex-1 overflow-y-auto px-3 py-4 space-y-2"
          >
            {messages.map((m) => {
              const isMe = m.side === "me";

              const bubble = isMe
                ? isWA
                  ? meBubbleWA
                  : meBubbleMS
                : themBubble;

              // Solo Messenger + light + "yo": más contraste para la hora
              const timeColor =
                isMe && !isWA && !isDark
                  ? "text-blue-900/80"
                  : isDark
                  ? "text-white/60"
                  : "text-neutral-600";

              return (
                <div
                  key={m.id}
                  className={cn("flex", isMe ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[78%] rounded-2xl px-3 py-2 text-[15px] leading-snug shadow-sm",
                      isMe ? "rounded-tr-md" : "rounded-tl-md",
                      bubble
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

                      {isMe ? (
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

          {/* Input bar (visual only) */}
          <div
            className={cn(
              "relative border-t px-3 py-3 backdrop-blur",
              isDark
                ? "border-white/10 bg-[#0b141a]/90"
                : "border-neutral-200 bg-white/80"
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex-1 rounded-full border px-4 py-3 text-sm",
                  isDark
                    ? "bg-white/5 border-white/10 text-white/60"
                    : "bg-neutral-50 border-neutral-200 text-neutral-500"
                )}
              >
                Message
              </div>

              <div
                className={cn(
                  "h-11 w-11 rounded-full grid place-items-center",
                  isWA
                    ? isDark
                      ? "bg-[#00a884]"
                      : "bg-[#25d366]"
                    : isDark
                    ? "bg-[#1f6fff]"
                    : "bg-[#0b5cff]"
                )}
                aria-hidden="true"
              >
                <Mic className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
