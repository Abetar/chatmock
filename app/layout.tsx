// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
const appName = "ChatMock";
const appTagline = "Generador de chats ficticios estilo WhatsApp y Messenger";
const appDescription =
  "Crea conversaciones ficticias estilo WhatsApp y Messenger para contenido. Personaliza nombre, mensajes, tema oscuro/claro y exporta a PNG en segundos. Sin login.";

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
    "chat whatsapp falso",
    "simulador de whatsapp",
    "fake chat generator",
    "messenger chat generator",
    "conversaciones ficticias",
    "crear chat para tiktok",
    "exportar chat a png",
    "mock chat",
    "simulador de mensajes",
  ],
  authors: [{ name: "AG Solutions" }],
  creator: "AG Solutions",
  publisher: "AG Solutions",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    // buena práctica para snippets (Google)
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
        url: "/og.png", // ✅ crea /public/og.png (1200x630)
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
    images: ["/og.png"],
    // Si tienes @usuario:
    // creator: "@tuuser",
  },

  // Favicons / icons (coloca en /public)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  // PWA-ish hints (opcionales)
  manifest: "/site.webmanifest",

  // Para Chrome UI (si quieres)
  // themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#070b10" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: appName,
    url: siteUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description: appDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
