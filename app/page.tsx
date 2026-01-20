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

      <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <div className="flex justify-center">
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
                    <OsToggle value={os} onChange={setOs} />
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

                {/* ✅ Wallpaper solo WhatsApp */}
                {platform === "whatsapp" ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">
                          Fondo de pantalla
                        </div>
                        <div className="text-xs text-white/55">
                          Solo afecta WhatsApp (no Messenger)
                        </div>
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
                        {/* preview pequeño */}
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
                ) : null}

                <MessageComposer
                  onAdd={(msg) => setMessages((prev) => [...prev, msg])}
                  // ✅ NUEVO: recibe urls de avatar desde el formulario y las guardamos aquí
                  onAvatarsChange={(v) => {
                    setWaContactAvatarUrl(v.contactAvatarUrl);
                    setWaMeAvatarUrl(v.meAvatarUrl);
                  }}
                  // ✅ opcional: mantener valores si re-render / switches
                  initialContactAvatarUrl={waContactAvatarUrl}
                  initialMeAvatarUrl={waMeAvatarUrl}
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
