import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Straver Pflanzen Export",
  description: "Planten en artikelen van Straver Pflanzen Export",
  other: {
    'preconnect': 'https://wpgaspsylimithekizvp.supabase.co',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        {children}
      </body>
    </html>
  );
}

