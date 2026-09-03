
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { LenisProvider } from "@/app/components/client/layout/LenisProvider";
import AppShell from "@/app/components/client/layout/AppShell";
import HeaderServer from "@/app/components/client/layout/HeaderServer";
import FooterServer from "@/app/components/client/layout/FooterServer";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
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
            {/* <HeaderServer /> */}
            {children}
            {/* <FooterServer /> */}
          </AppShell>
        </LenisProvider>
      </body>
    </html>
  );
}