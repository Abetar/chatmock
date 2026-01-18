// components/PlatformToggle.tsx
"use client";

import type { Platform } from "@/lib/types";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils-cn";

export function PlatformToggle({
  value,
  onChange,
}: {
  value: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
      <button
        onClick={() => onChange("whatsapp")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-sm",
          value === "whatsapp" ? "bg-white/10 text-white" : "text-white/70"
        )}
        aria-pressed={value === "whatsapp"}
      >
        <Send className="h-4 w-4" />
        WhatsApp
      </button>
      <button
        onClick={() => onChange("messenger")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full text-sm",
          value === "messenger" ? "bg-white/10 text-white" : "text-white/70"
        )}
        aria-pressed={value === "messenger"}
      >
        <MessageCircle className="h-4 w-4" />
        Messenger
      </button>
    </div>
  );
}
