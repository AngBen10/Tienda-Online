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
  metadataBase: new URL("https://tienda-online-anglic.vercel.app"),
  title: "Anglic - Hogar & Diseño",
  description: "Productos para el hogar, tecnología y diseño. Envíos a todo Paraguay.",
  openGraph: {
    title: "Anglic - Hogar & Diseño",
    description: "Productos para el hogar, tecnología y diseño. Envíos a todo Paraguay.",
    url: "https://tienda-online-anglic.vercel.app",
    siteName: "Anglic",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Subí una imagen 1200x630 a la carpeta /public
        width: 1200,
        height: 630,
        alt: "Anglic - Hogar & Diseño",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anglic - Hogar & Diseño",
    description: "Productos para el hogar, tecnología y diseño. Envíos a todo Paraguay.",
    images: ["/og-image.jpg"],
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
