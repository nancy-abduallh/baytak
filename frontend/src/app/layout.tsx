import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DEFAULT_DESCRIPTION,
  getOrganizationSchema,
  getWebSiteSchema,
} from "@/lib/seo";
import "./globals.css";

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#071E1B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "صيانة منازل",
    "صيانة منازل السعودية",
    "صيانة منازل بالرياض",
    "سباك بالرياض",
    "كهربائي منازل",
    "صيانة مكيفات سبليت",
    "تنظيف فلل بالرياض",
    "دهانات وديكورات",
    "نجار بالرياض",
    "كشف تسربات المياه بدون تكسير",
    "فنيين معتمدين",
    "منصة بيتك",
    "خدمات منزلية بالسعودية",
    "صيانة فورية للمنازل",
  ],
  referrer: "origin-when-cross-origin",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/",
      ar: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
    creator: "@BaytakKsa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
      </head>
      <body className={`${almarai.variable} font-body antialiased`} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
