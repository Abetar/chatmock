// components/MessageComposer.tsx
"use client";

import { useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils-cn";

function nowTime() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  const hr12 = ((h + 11) % 12) + 1;
  return `${hr12}:${m} ${ampm}`;
}

export function MessageComposer({
  onAdd,
}: {
  onAdd: (msg: ChatMessage) => void;
}) {
  const [side, setSide] = useState<"me" | "them">("me");
  const [text, setText] = useState("");
  const [time, setTime] = useState(nowTime());

  const canAdd = useMemo(() => text.trim().length > 0, [text]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide("me")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            side === "me"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border-white/10 text-white/70"
          )}
        >
          Yo (derecha)
        </button>
        <button
          onClick={() => setSide("them")}
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            side === "them"
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/5 border-white/10 text-white/70"
          )}
        >
          Otra persona (izquierda)
        </button>
      </div>

      <label className="block">
        <span className="text-xs text-white/60">Mensaje</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Escribe el texto…"
          className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/25"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs text-white/60">Hora</span>
          <input
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/25"
          />
        </label>

        <button
          onClick={() => setTime(nowTime())}
          className="mt-6 rounded-xl bg-white/10 border border-white/10 text-white/80 px-3 py-2 hover:bg-white/15"
        >
          Hora actual
        </button>
      </div>

      <button
        disabled={!canAdd}
        onClick={() => {
          const msg: ChatMessage = {
            id: crypto.randomUUID(),
            side,
            text: text.trim(),
            time: time.trim() || nowTime(),
            status: side === "me" ? "read" : undefined,
          };
          onAdd(msg);
          setText("");
        }}
        className={cn(
          "w-full rounded-2xl py-3 font-medium",
          canAdd
            ? "bg-emerald-500/90 hover:bg-emerald-500 text-black"
            : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
        )}
      >
        Agregar mensaje
      </button>

      <p className="text-[11px] text-white/45 leading-snug">
        Recomendado: mantener un watermark/disclaimer para evitar mal uso y para que Ads no te rechace.
      </p>
    </div>
  );
}
