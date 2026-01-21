// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Ajusta esto a tu dominio real (Vercel o custom)
const siteUrl = "https://chatmock.vercel.app";
const agUrl = "https://agsolutions.dev";

const appName = "ChatMock";
const appTagline = "Generador de previews de chat estilo WhatsApp y Messenger";
const appDescription =
  "Crea previews simulados estilo WhatsApp y Messenger para contenido, storytelling y mockups visuales. Personaliza nombre, mensajes, tema oscuro/claro y exporta a PNG en segundos. Sin login.";

// ✅ Recomendado: crea /public/og.png (1200x630)
const ogImage = "/og.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: `${appName} — ${appTagline}`,
    template: `%s — ${appName}`,
  },
  description: appDescription,

  applicationName: appName,
  category: "Technology",
  keywords: [
    "generador de chat",
    "chat simulado",
    "chat mockup",
    "mock chat",
    "fake chat generator",
    "messenger chat generator",
    "whatsapp chat generator",
    "conversaciones simuladas",
    "crear chat para tiktok",
    "exportar chat a png",
    "simulador de mensajes",
    "chat preview",
  ],
  authors: [{ name: "AG Solutions", url: agUrl }],
  creator: "AG Solutions",
  publisher: "AG Solutions",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // Open Graph (Google, FB, WhatsApp previews)
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${appName} — ${appTagline}`,
    description: appDescription,
    siteName: appName,
    locale: "es_MX",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${appName} preview`,
      },
    ],
  },

  // Twitter card
  twitter: {
    card: "summary_large_image",
    title: `${appName} — ${appTagline}`,
    description: appDescription,
    images: [ogImage],
    // Si tienes @usuario:
    // creator: "@tuuser",
    // site: "@tuuser",
  },

  // Favicons / icons (coloca en /public)
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  // PWA-ish hints (opcionales)
  manifest: "/site.webmanifest",

  // ✅ Ayuda a que el UI del navegador se vea coherente (opcional)
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070b10" },
    { media: "(prefers-color-scheme: light)", color: "#f3f4f6" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ✅ JSON-LD mejorado: Organization + WebApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "AG Solutions",
        url: agUrl,
      },
      {
        "@type": "WebApplication",
        name: appName,
        url: siteUrl,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        description: appDescription,
        publisher: {
          "@type": "Organization",
          name: "AG Solutions",
          url: agUrl,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ JSON-LD para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
