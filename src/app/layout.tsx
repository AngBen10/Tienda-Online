import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  title: "Lechugas Premium",
  description: "Lechugas hidropónicas frescas, crujientes y de la mejor calidad.",
  openGraph: {
    title: "Lechugas Premium",
    description: "Lechugas hidropónicas frescas, crujientes y de la mejor calidad.",
    url: "https://tienda-online-anglic.vercel.app",
    siteName: "Lechugas",
    locale: "es_PY",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lechugas Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lechugas Premium",
    description: "Lechugas hidropónicas frescas, crujientes y de la mejor calidad.",
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
        {children}
      </body>
    </html>
  );
}
