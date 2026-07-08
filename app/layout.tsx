import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Workaround: Next.js 15 con app router puro intenta pre-renderizar /404
// usando un shell legacy que llama useHtmlContext() sin provider. Marcar
// como dynamic-ish evita el flujo defectuoso.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#0b1417",
};

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_BASE),
  title: "Órganon — lenguaje natural a lógica formal · Steven Vallejo · Mouseîon",
  description:
    "Órganon: convierte texto en español a lógica formal ejecutable sin IA. Herramienta de Steven Vallejo. autologic + ST (SAT solver CDCL). Ecosistema Mouseîon.",
  keywords: ["Órganon", "lógica formal", "NLP", "Steven Vallejo", "Mouseîon", "autologic", "ST", "SAT solver"],
  authors: [{ name: "Steven Vallejo", url: "https://www.stevenvallejo.com" }],
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
    title: "Órganon — lógica formal en español · Steven Vallejo",
    description:
      "Herramienta de Steven Vallejo: transforma lenguaje natural a lógica formal ejecutable sin IA. autologic (NLP reglas) + ST (SAT solver CDCL). Mouseîon.",
    locale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Órganon — NLP a lógica formal de Steven Vallejo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Órganon — lógica formal en español · Steven Vallejo",
    description:
      "Herramienta de Steven Vallejo: text→lógica sin IA. autologic + ST (SAT CDCL). Mouseîon.",
    images: ["/og-image.png"],
    creator: "@stevenvo780",
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
        description: "Playground interactivo: lenguaje natural a lógica formal sin IA",
        publisher: {
          "@type": "Organization",
          name: "Mouseîon",
          url: "https://www.stevenvallejo.com",
          logo: {
            "@type": "ImageObject",
            url: "https://www.stevenvallejo.com/logo.png",
          },
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": CANONICAL_BASE + "/#app",
        name: "Órganon",
        alternateName: ["nlp-to-logic", "NLP a lógica"],
        url: CANONICAL_BASE + "/",
        inLanguage: "es",
        description:
          "Convertidor de lenguaje natural a lógica formal ejecutable sin inteligencia artificial. Usa autologic (NLP basado en reglas) y ST (SAT solver CDCL propio).",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        isPartOf: { "@id": CANONICAL_BASE + "/#website" },
        author: { "@id": CANONICAL_BASE + "/#person" },
        creator: { "@id": CANONICAL_BASE + "/#person" },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/OnlineOnly",
        },
        potentialAction: {
          "@type": "UseAction",
          target: CANONICAL_BASE + "/",
        },
      },
      {
        "@type": "Person",
        "@id": CANONICAL_BASE + "/#person",
        name: "Steven Vallejo",
        givenName: "Steven",
        familyName: "Vallejo",
        url: "https://www.stevenvallejo.com",
        email: "stevenvallejo780@gmail.com",
        image: "https://www.stevenvallejo.com/avatar.jpg",
        sameAs: [
          "https://github.com/stevenvo780",
          "https://www.linkedin.com/in/stevenvo780",
          "https://medium.com/@stevenvallejo780",
          "https://www.stevenvallejo.com",
        ],
        jobTitle: "Software Engineer & Philosopher",
        worksFor: { "@type": "Organization", name: "Mouseîon" },
      },
    ],
  };

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorantGaramond.variable} h-full antialiased`}
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
