// components/MobileTabs.tsx
"use client";

import { cn } from "@/lib/utils-cn";

export function MobileTabs({
  value,
  onChange,
}: {
  value: "edit" | "preview";
  onChange: (v: "edit" | "preview") => void;
}) {
  return (
    <div className="md:hidden sticky top-0 z-30 bg-[#0b141a]/90 backdrop-blur border-b border-white/10">
      <div className="px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => onChange("edit")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium border",
            value === "edit"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-transparent border-white/10 text-white/70"
          )}
        >
          Editar
        </button>
        <button
          onClick={() => onChange("preview")}
          className={cn(
            "flex-1 rounded-full py-2 text-sm font-medium border",
            value === "preview"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-transparent border-white/10 text-white/70"
          )}
        >
          Preview
        </button>
      </div>
    </div>
  );
}
