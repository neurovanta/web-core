
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { LenisProvider } from "../components/client/layout/LenisProvider";
import AppShell from "../components/client/layout/AppShell";
import HeaderServer from "../components/client/layout/HeaderServer";
import FooterServer from "../components/client/layout/FooterServer";

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