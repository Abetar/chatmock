// app/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import { sampleMessages } from "@/lib/sample";
import { PlatformToggle } from "@/components/PlatformToggle";
import { ChatPreview } from "@/components/ChatPreview";
import { MessageComposer } from "@/components/MessageComposer";
import { MobileTabs } from "@/components/MobileTabs";
import type { ChatMessage, Platform, Theme, OS } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toPng } from "html-to-image";
import { OsToggle } from "@/components/OsToggle";

export default function Page() {
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [contactName, setContactName] = useState("Benito Camelo");
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [theme, setTheme] = useState<Theme>("dark");
  const [os, setOs] = useState<OS>("android");

  // ✅ Wallpaper (solo WhatsApp)
  const [wallpaperUrl, setWallpaperUrl] = useState<string | null>(null);

  // ✅ NUEVO: avatares (solo WhatsApp por ahora)
  const [waContactAvatarUrl, setWaContactAvatarUrl] = useState<string>("");
  const [waMeAvatarUrl, setWaMeAvatarUrl] = useState<string>("");

  // ✅ ref al contenedor que vamos a exportar
  const previewRef = useRef<HTMLDivElement | null>(null);

  const preview = useMemo(
    () => (
      <ChatPreview
        platform={platform}
        theme={theme}
        os={os}
        contactName={contactName}
        messages={messages}
        // ✅ solo pasa wallpaper si es WhatsApp
        wallpaperUrl={platform === "whatsapp" ? wallpaperUrl : null}
        // ✅ NUEVO: avatares (solo WhatsApp por ahora)
        contactAvatarUrl={platform === "whatsapp" ? waContactAvatarUrl : null}
        meAvatarUrl={platform === "whatsapp" ? waMeAvatarUrl : null}
      />
    ),
    [
      platform,
      theme,
      os,
      contactName,
      messages,
      wallpaperUrl,
      waContactAvatarUrl,
      waMeAvatarUrl,
    ]
  );

  // ✅ Cargar wallpaper (archivo -> dataURL)
  async function onWallpaperFile(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setWallpaperUrl(result);
    };
    reader.readAsDataURL(file);
  }

  // ✅ Export PNG (vista) - FIX: clon off-screen para evitar recortes
  async function exportPng() {
    if (!previewRef.current) return;

    await (document as any).fonts?.ready;
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const clone = previewRef.current.cloneNode(true) as HTMLDivElement;

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.style.background = theme === "dark" ? "#070b10" : "#f3f4f6";
    wrapper.style.padding = "24px";
    wrapper.style.width = "max-content";

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
  async function exportFullConversationPng() {
    if (!previewRef.current) return;

    await (document as any).fonts?.ready;
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const clone = previewRef.current.cloneNode(true) as HTMLDivElement;

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-10000px";
    wrapper.style.top = "0";
    wrapper.style.zIndex = "999999";
    wrapper.style.background = theme === "dark" ? "#070b10" : "#f3f4f6";
    wrapper.style.padding = "24px";
    wrapper.style.width = "max-content";

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      const viewport = clone.querySelector(
        "[data-chat-viewport]"
      ) as HTMLElement | null;
      if (viewport) {
        viewport.style.height = "auto";
        viewport.style.maxHeight = "none";
      }

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

      {/* ✅ Ko-fi Sticky CTA (no export) */}
      <a
        data-noexport="true"
        href="https://ko-fi.com/abrahamgomez96"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-emerald-500 text-black font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
        aria-label="Apóyame en Ko-fi"
        title="Apóyame en Ko-fi"
      >
        <span aria-hidden="true">☕</span>
        <span className="text-sm">Ko-fi</span>
        <span className="text-sm hidden sm:inline">Apóyame</span>
      </a>

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="flex justify-center">
          <div className="w-full max-w-[980px] flex flex-col md:flex-row md:items-start gap-6 md:gap-8">
            {/* Editor */}
            <section
              className={`md:w-[420px] ${
                tab === "preview" ? "hidden md:block" : ""
              } md:sticky md:top-6 self-start`}
            >
              <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 md:p-6 md:max-h-[calc(100vh-5.5rem)] md:overflow-y-auto md:pr-2">
                {/* Header / Toolbar */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1">
                      <h1 className="text-lg font-semibold leading-tight">
                        Chat Generator
                      </h1>
                      <p className="text-sm text-white/60">
                        WhatsApp / Messenger (simulado)
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <ThemeToggle value={theme} onChange={setTheme} />
                      <OsToggle value={os} onChange={setOs} />
                      <PlatformToggle value={platform} onChange={setPlatform} />
                    </div>
                  </div>

                  {/* ✅ Built by (visible desde arriba) */}
                  <div
                    data-noexport="true"
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="text-xs text-white/55">
                      Built by{" "}
                      <a
                        href="https://agsolutions.dev"
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/40"
                      >
                        AG Solutions
                      </a>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href="https://agsolutions.dev"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                      >
                        Ver más tools
                      </a>
                      <a
                        href="https://ko-fi.com/abrahamgomez96"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs rounded-xl px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/15"
                      >
                        ☕ Ko-fi
                      </a>
                    </div>
                  </div>
                </div>

                {/* ✅ Compact spacing (menos “form largo”) */}
                <div className="mt-4 space-y-3">
                  {/* ✅ Identidad (colapsable) */}
                  <details
                    open
                    className="group rounded-2xl border border-white/10 bg-white/5"
                  >
                    <summary className="cursor-pointer list-none select-none p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium">Identidad</div>
                          <div className="text-xs text-white/50 hidden sm:block">
                            Ajusta el nombre que aparece en el header.
                          </div>
                        </div>
                        <span className="text-white/50 text-sm group-open:rotate-180 transition-transform">
                          ▾
                        </span>
                      </div>
                    </summary>

                    <div className="px-4 pb-4">
                      <label className="block">
                        <span className="text-xs text-white/60">
                          Nombre del contacto
                        </span>
                        <input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="mt-1 w-full rounded-2xl bg-[#0b1220]/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/25"
                          placeholder="Ej. Benito Camelo"
                        />
                      </label>
                    </div>
                  </details>

                  {/* ✅ Fondo de pantalla (colapsable, cerrado por defecto) */}
                  {platform === "whatsapp" ? (
                    <details className="group rounded-2xl border border-white/10 bg-white/5">
                      <summary className="cursor-pointer list-none select-none p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium">
                              Fondo de pantalla
                            </div>
                            <div className="text-xs text-white/50 hidden sm:block">
                              Solo WhatsApp (opcional)
                            </div>
                          </div>
                          <span className="text-white/50 text-sm group-open:rotate-180 transition-transform">
                            ▾
                          </span>
                        </div>
                      </summary>

                      <div className="px-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-xs text-white/55">
                            Sube una imagen o usa el fondo neutro.
                          </div>

                          {wallpaperUrl ? (
                            <button
                              type="button"
                              onClick={() => setWallpaperUrl(null)}
                              className="text-xs rounded-xl px-3 py-2 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                            >
                              Quitar
                            </button>
                          ) : null}
                        </div>

                        <label className="block">
                          <span className="sr-only">Subir fondo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              onWallpaperFile(e.target.files?.[0] ?? null)
                            }
                            className="block w-full text-xs text-white/70 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-500/90 file:px-3 file:py-2 file:text-black file:font-semibold hover:file:bg-emerald-500"
                          />
                        </label>

                        {wallpaperUrl ? (
                          <div className="rounded-2xl overflow-hidden border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={wallpaperUrl}
                              alt="Wallpaper preview"
                              className="h-24 w-full object-cover opacity-90"
                            />
                          </div>
                        ) : (
                          <div className="text-xs text-white/45">
                            Si no subes uno, se usa un fondo neutro.
                          </div>
                        )}
                      </div>
                    </details>
                  ) : null}

                  {/* ✅ Mensajes (bloque dominante) */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 ring-1 ring-white/5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Mensajes</div>
                        <div className="text-xs text-white/50 hidden sm:block">
                          Los avatares solo se ven en audios.
                        </div>
                      </div>

                      {/* hint compacto */}
                      <span className="text-[11px] text-white/35 hidden md:inline">
                        Edit → Preview
                      </span>
                    </div>

                    <MessageComposer
                      onAdd={(msg) => setMessages((prev) => [...prev, msg])}
                      onAvatarsChange={(v) => {
                        setWaContactAvatarUrl(v.contactAvatarUrl);
                        setWaMeAvatarUrl(v.meAvatarUrl);
                      }}
                      initialContactAvatarUrl={waContactAvatarUrl}
                      initialMeAvatarUrl={waMeAvatarUrl}
                    />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMessages([])}
                      className="rounded-2xl py-3 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setMessages(sampleMessages)}
                      className="rounded-2xl py-3 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                    >
                      Demo
                    </button>
                  </div>

                  {/* Export */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Export</div>
                        <div className="text-xs text-white/50 hidden sm:block">
                          Descarga en alta calidad.
                        </div>
                      </div>
                      <span className="text-[11px] text-white/35">
                        PNG • 2x
                      </span>
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
                      BETA: genera una imagen larga sin scroll.
                    </p>
                  </div>

                  {/* ✅ Footer ultra-minimal (ya no "escondido") */}
                  <div
                    data-noexport="true"
                    className="pt-3 border-t border-white/10 space-y-2"
                  >
                    <p className="text-[11px] text-white/45 leading-snug">
                      Nota: mock UI para contenido. No afiliado a WhatsApp ni
                      Meta. Evitamos logos/marcas oficiales.
                    </p>

                    <p className="text-[11px] text-white/35">
                      © {new Date().getFullYear()} AG Solutions
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview */}
            <section className={cnPreviewSection(tab)}>
              {/* ✅ FIX: overflow horizontal para mobile + no recortar header */}
              <div className="w-full overflow-x-auto overflow-y-visible overscroll-x-contain px-2">
                <div ref={previewRef} className="w-max mx-auto">
                  {preview}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function cnPreviewSection(tab: "edit" | "preview") {
  return `flex-1 ${tab === "edit" ? "hidden md:flex" : ""} md:justify-center`;
}
