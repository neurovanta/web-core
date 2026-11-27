
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { LenisProvider } from "../components/client/layout/LenisProvider";
import AppShell from "../components/client/layout/AppShell";
import HeaderServer from "../components/client/layout/HeaderServer";
import FooterServer from "../components/client/layout/FooterServer";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  // makes page canonicals (alternates.canonical) absolute; set NEXT_PUBLIC_SITE_URL per environment
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: "Neuro Vanta",
  description: "Neuro Vanta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html style={{ overflow: "hidden" }} lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Toaster />
        <LenisProvider>
          <AppShell>
            <HeaderServer />
            {children}
            <FooterServer />
          </AppShell>
        </LenisProvider>
      </body>
    </html>
  );
}