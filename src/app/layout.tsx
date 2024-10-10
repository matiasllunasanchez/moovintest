"use client";
import { ReactNode, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { UserProvider } from "../contexts/UserContext"; // Ajusta la ruta según la ubicación de tu UserContext
import ClientLayout from "./client-layout";
import Head from "./head";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import Hotjar from "@hotjar/browser";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const siteId = Number(process.env.NEXT_PUBLIC_HOTJAR_SITE_ID ?? 0);
    const hotjarVersion = Number(process.env.NEXT_PUBLIC_HOTJAR_VERSION ?? 0);
    Hotjar.init(siteId, hotjarVersion);
  }, []);

  return (
    <html lang="en">
      <Head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased bg-white",
          fontSans.className
        )}
      >
        <SessionProvider>
          <UserProvider>
            <ClientLayout>{children} </ClientLayout>
            <Toaster />
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
