export const metadata = {
  title: "Neuro Vanta | Backend Console",
  description: "Neuro Vanta",
};

import "../../../globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="en" className={`antialiased`}>
      {children}
    </div>
  );
}
