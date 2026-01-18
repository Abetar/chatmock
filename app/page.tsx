// app/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { sampleMessages } from "@/lib/sample";
import { PlatformToggle } from "@/components/PlatformToggle";
import { ChatPreview } from "@/components/ChatPreview";
import { MessageComposer } from "@/components/MessageComposer";
import { MobileTabs } from "@/components/MobileTabs";
import type { ChatMessage, Platform, Theme } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toPng } from "html-to-image";

export default function Page() {
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [contactName, setContactName] = useState("Benito Camelo");
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [theme, setTheme] = useState<Theme>("dark");

  // ✅ ref al contenedor que vamos a exportar
  const previewRef = useRef<HTMLDivElement | null>(null);

  const preview = useMemo(
    () => (
      <ChatPreview
        platform={platform}
        theme={theme}
        contactName={contactName}
        messages={messages}
      />
    ),
    [platform, theme, contactName, messages]
  );

  // ✅ Export PNG (vista)
  // ✅ Export PNG (vista) - FIX: exportar desde clon off-screen para evitar recortes
  async function exportPng() {
    if (!previewRef.current) return;

    // Espera a que carguen fuentes (evita glitches)
    await (document as any).fonts?.ready;
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    // 1) Clonar el preview
    const clone = previewRef.current.cloneNode(true) as HTMLDivElement;

    // 2) Montarlo fuera de pantalla para que html-to-image calcule bien tamaños
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.style.background = theme === "dark" ? "#070b10" : "#f3f4f6";
    wrapper.style.padding = "24px";
    wrapper.style.width = "max-content"; // importante: que no estire raro

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      const filename = `chat-${platform}-${theme}-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme === "dark" ? "#070b10" : "#f3f4f6",
        filter: (domNode) => {
          const el = domNode as HTMLElement;
          return el?.dataset?.noexport !== "true";
        },
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } finally {
      document.body.removeChild(wrapper);
    }
  }

  // ✅ Export PNG (conversación completa - BETA)
  // ✅ Export PNG (conversación completa - BETA)
  async function exportFullConversationPng() {
    if (!previewRef.current) return;

    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const clone = previewRef.current.cloneNode(true) as HTMLDivElement;

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.style.background = theme === "dark" ? "#070b10" : "#f3f4f6";
    wrapper.style.padding = "24px";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      // Expandir viewport (quitar alto fijo)
      const viewport = clone.querySelector(
        "[data-chat-viewport]"
      ) as HTMLElement | null;
      if (viewport) {
        viewport.style.height = "auto";
        viewport.style.maxHeight = "none";
      }

      // Expandir scroller (quitar overflow)
      const scroller = clone.querySelector(
        "[data-chat-scroll]"
      ) as HTMLElement | null;
      if (scroller) {
        scroller.style.overflow = "visible";
        scroller.style.height = "auto";
        scroller.style.maxHeight = "none";
      }

      const filename = `chat-full-${platform}-${theme}-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: theme === "dark" ? "#070b10" : "#f3f4f6",
        filter: (domNode) => {
          const el = domNode as HTMLElement;
          return el?.dataset?.noexport !== "true";
        },
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } finally {
      document.body.removeChild(wrapper);
    }
  }

  return (
    <main className="min-h-screen bg-[#070b10] text-white">
      <MobileTabs value={tab} onChange={setTab} />

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {/* ✅ CENTRADO GLOBAL DEL BLOQUE */}
        <div className="flex justify-center">
          {/* ✅ limita ancho real para que se vea balanceado */}
          <div className="w-full max-w-[980px] flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            {/* Editor */}
            <section
              className={`md:w-[420px] ${
                tab === "preview" ? "hidden md:block" : ""
              }`}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-lg font-semibold leading-tight">
                      Chat Generator
                    </h1>
                    <p className="text-sm text-white/60">
                      WhatsApp / Messenger (simulado)
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <ThemeToggle value={theme} onChange={setTheme} />
                    <PlatformToggle value={platform} onChange={setPlatform} />
                  </div>
                </div>

                <label className="block">
                  <span className="text-xs text-white/60">
                    Nombre del contacto
                  </span>
                  <input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="mt-1 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/25"
                    placeholder="Ej. Benito Camelo"
                  />
                </label>

                <MessageComposer
                  onAdd={(msg) => setMessages((prev) => [...prev, msg])}
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setMessages([])}
                    className="flex-1 rounded-2xl py-3 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setMessages(sampleMessages)}
                    className="flex-1 rounded-2xl py-3 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                  >
                    Demo
                  </button>
                </div>

                <button
                  onClick={exportPng}
                  className="w-full rounded-2xl py-3 bg-emerald-500/90 hover:bg-emerald-500 text-black font-semibold"
                >
                  Descargar PNG (vista)
                </button>

                <button
                  onClick={exportFullConversationPng}
                  className="w-full rounded-2xl py-3 bg-white/5 border border-white/10 text-white/85 hover:bg-white/10"
                >
                  Exportar conversación completa (BETA)
                </button>

                <p className="text-[11px] text-white/45 leading-snug">
                  BETA: export completo genera una imagen larga sin scroll.
                </p>

                <a
                  href="https://ko-fi.com/abrahamgomez96"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center rounded-2xl py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/15"
                >
                  ☕ Apóyame en Ko-fi
                </a>

                <p className="text-[11px] text-white/45 leading-snug">
                  Nota: Evitamos logos/marcas oficiales. Esto es un mock para
                  contenido.
                </p>
              </div>
            </section>

            {/* Preview */}
            <section className={cnPreviewSection(tab)}>
              <div ref={previewRef} className="w-fit md:mx-auto">
                {preview}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

// helper simple para mantener limpio el className
function cnPreviewSection(tab: "edit" | "preview") {
  return `flex-1 ${tab === "edit" ? "hidden md:flex" : ""} md:justify-center`;
}
