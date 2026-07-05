import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://anglic.com.py"),
  title: "Anglic - Hogar, Tecnología & Diseño",
  description:
    "Descubrí los mejores productos de hogar, tecnología y diseño en un solo lugar. Calidad premium al mejor precio en Paraguay.",
  openGraph: {
    title: "Anglic - Hogar, Tecnología & Diseño",
    description:
      "Descubrí los mejores productos de hogar, tecnología y diseño en un solo lugar. Calidad premium al mejor precio en Paraguay.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anglic - Hogar, Tecnología & Diseño",
      },
    ],
    locale: "es_PY",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
