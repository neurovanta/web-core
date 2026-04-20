
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { LenisProvider } from "../components/client/layout/LenisProvider";
import Footer from "../components/client/layout/Footer";
import HeaderV2 from "../components/client/layout/HeaderV2";
import AppShellV2 from "../components/client/layout/AppShellV2";

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
          <AppShellV2>
            <HeaderV2 />
            {children}
            <Footer />
          </AppShellV2>
        </LenisProvider>
      </body>
    </html>
  );
}