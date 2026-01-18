"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils-cn";
import type { Theme } from "@/lib/types";

export function ThemeToggle({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (t: Theme) => void;
}) {
  const isDark = value === "dark";

  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm",
        "border-white/10 bg-white/5 hover:bg-white/10 transition"
      )}
      aria-label="Cambiar tema del chat"
      aria-pressed={isDark}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
