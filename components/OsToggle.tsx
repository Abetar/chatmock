"use client";

import { cn } from "@/lib/utils-cn";
import type { OS } from "@/lib/types";
import { Smartphone, Apple } from "lucide-react";

export function OsToggle({
  value,
  onChange,
}: {
  value: OS;
  onChange: (v: OS) => void;
}) {
  return (
    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => onChange("android")}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          value === "android"
            ? "bg-white/10 text-white"
            : "text-white/70 hover:bg-white/5"
        )}
        aria-pressed={value === "android"}
      >
        <Smartphone className="h-4 w-4" />
        Android
      </button>

      <button
        type="button"
        onClick={() => onChange("ios")}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
          value === "ios"
            ? "bg-white/10 text-white"
            : "text-white/70 hover:bg-white/5"
        )}
        aria-pressed={value === "ios"}
      >
        <Apple className="h-4 w-4" />
        iOS
      </button>
    </div>
  );
}
