"use client";

import { Mic, Play, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils-cn";

export function WhatsAppAudioBubble({
  isMe,
  isDark,
  initial,
  durationSec,
  time,
  showUnplayedDot,
  status,
  avatarUrl,
}: {
  isMe: boolean;
  isDark: boolean;
  initial: string;
  durationSec: number;
  time: string;
  showUnplayedDot: boolean;
  status?: "sent" | "delivered" | "read";
  avatarUrl?: string | null;
}) {
  function formatDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  const timeColor = isDark ? "text-white/60" : "text-neutral-600";

  // ✅ FIX export: usa rgba clásico para que html-to-image lo renderice bien
  const dotColor = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
  const knobColor = isDark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.25)";
  const unplayedColor = isDark ? "rgba(125,211,252,0.90)" : "rgb(14,165,233)"; // sky-ish

  return (
    <div className="px-3 py-2.5">
      <div className="flex items-center min-w-0">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "h-12 w-12 rounded-full overflow-hidden border grid place-items-center text-sm font-semibold",
              isDark
                ? "border-white/10 bg-black/20 text-white/80"
                : "border-black/10 bg-black/5 text-neutral-900/80"
            )}
            aria-hidden="true"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              initial
            )}
          </div>

          {/* mic */}
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5",
              isDark ? "text-[#53bdeb]" : "text-[#34b7f1]"
            )}
            aria-hidden="true"
          >
            <Mic className="h-5 w-5" />
          </span>
        </div>

        {/* Play */}
        <button
          type="button"
          aria-label="Play"
          className="ml-2 shrink-0 h-10 w-10 rounded-full grid place-items-center"
        >
          <Play
            className={cn(
              "h-5 w-5",
              isDark ? "text-white/55" : "text-neutral-900/55"
            )}
          />
        </button>

        {/* Right block */}
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex flex-col min-w-0 h-[44px]">
            <div className="flex items-center justify-center flex-1 min-w-0">
              <div className="flex items-center w-full min-w-0">
                {/* ✅ knob */}
                <span
                  className="inline-block h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: knobColor }}
                  aria-hidden="true"
                />

                <div className="ml-2 flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-[3px] whitespace-nowrap">
                    {Array.from({ length: 24 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="inline-block h-[3px] w-[3px] rounded-full"
                        style={{ backgroundColor: dotColor }} // ✅ FIX
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <span
                  className={cn(
                    "ml-2 shrink-0 text-[12px] font-semibold",
                    isDark ? "text-white/35" : "text-neutral-700/45"
                  )}
                >
                  1x
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                {showUnplayedDot ? (
                  <span
                    className="inline-block h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: unplayedColor }} // ✅ FIX
                    aria-hidden="true"
                  />
                ) : null}

                <span
                  className={cn(
                    "text-[12px] whitespace-nowrap",
                    isDark ? "text-white/35" : "text-neutral-900/45"
                  )}
                >
                  {formatDuration(durationSec || 1)}
                </span>
              </div>

              <div
                className={cn(
                  "ml-auto flex items-center gap-1 text-[11px] whitespace-nowrap",
                  timeColor
                )}
              >
                <span>{time}</span>

                {isMe ? (
                  <span
                    className={cn(
                      "ml-1 inline-flex items-center shrink-0",
                      status === "read"
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
        </div>
      </div>
    </div>
  );
}
