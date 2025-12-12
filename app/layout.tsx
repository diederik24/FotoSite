import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Straver Pflanzen Export",
  description: "Planten en artikelen van Straver Pflanzen Export",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://wpgaspsylimithekizvp.supabase.co" />
        <link rel="dns-prefetch" href="https://wpgaspsylimithekizvp.supabase.co" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

