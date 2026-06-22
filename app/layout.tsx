import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Workaround: Next.js 15 con app router puro intenta pre-renderizar /404
// usando un shell legacy que llama useHtmlContext() sin provider. Marcar
// como dynamic-ish evita el flujo defectuoso.
export const dynamic = 'auto'; // default, pero explicito

const CANONICAL_BASE = "https://organon.stevenvallejo.com";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0b1417",
};

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_BASE),
  title: "Órganon — lenguaje natural a lógica formal · Mouseîon",
  description:
    "Órganon convierte texto en español a lógica formal ejecutable sin IA: autologic formaliza argumentos y ST (SAT solver CDCL) los evalúa en vivo. Parte del ecosistema Mouseîon.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: CANONICAL_BASE + "/",
    siteName: "Mouseîon",
    title: "Órganon — lenguaje natural a lógica formal · Mouseîon",
    description:
      "Convierte texto en español a lógica formal ejecutable sin IA. autologic + ST (SAT solver CDCL propio). Parte del ecosistema Mouseîon de Steven Vallejo.",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Órganon — NLP a lógica formal · Mouseîon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Órganon — lenguaje natural a lógica formal · Mouseîon",
    description:
      "Convierte texto en español a lógica formal ejecutable sin IA. autologic + ST (SAT solver CDCL propio). Parte del ecosistema Mouseîon de Steven Vallejo.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": CANONICAL_BASE + "/#website",
        url: CANONICAL_BASE + "/",
        name: "Órganon",
        description:
          "Playground interactivo que convierte lenguaje natural a lógica formal ejecutable sin IA.",
        publisher: {
          "@type": "Organization",
          name: "Mouseîon",
          url: "https://stevenvallejo.com/",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": CANONICAL_BASE + "/#app",
        name: "Órganon",
        alternateName: "nlp-to-logic",
        url: CANONICAL_BASE + "/",
        inLanguage: "es",
        description:
          "Convierte texto en español a lógica formal ejecutable sin IA. autologic formaliza el argumento (NLP basado en reglas) y ST lo evalúa con un SAT solver CDCL propio.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        isPartOf: {
          "@type": "WebSite",
          name: "Mouseîon",
          url: "https://stevenvallejo.com/",
        },
        author: { "@id": CANONICAL_BASE + "/#person" },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
      },
      {
        "@type": "Person",
        "@id": CANONICAL_BASE + "/#person",
        name: "Steven Vallejo",
        url: "https://stevenvallejo.com/",
        sameAs: [
          "https://github.com/stevenvo780",
          "https://www.linkedin.com/in/stevenvo780",
        ],
      },
    ],
  };

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
