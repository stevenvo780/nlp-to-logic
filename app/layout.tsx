import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_BASE),
  title: "Órganon — lenguaje natural a lógica formal · Mouseîon",
  description:
    "Órganon convierte texto en español a lógica formal ejecutable sin IA: autologic formaliza el argumento y ST (SAT solver CDCL) lo evalúa en vivo. Parte del ecosistema Mouseîon de Steven Vallejo.",
  alternates: {
    canonical: "/",
  },
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#0b1417",
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
        inLanguage: "es",
        publisher: { "@id": CANONICAL_BASE + "/#person" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": CANONICAL_BASE + "/#app",
        name: "Órganon",
        alternateName: "nlp-to-logic",
        url: CANONICAL_BASE + "/",
        description:
          "Convierte texto en español a lógica formal ejecutable sin IA. autologic formaliza el argumento (NLP basado en reglas) y ST lo evalúa con un SAT solver CDCL propio.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        inLanguage: "es",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0b1417" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
