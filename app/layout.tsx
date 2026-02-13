import type { Metadata } from "next";
import "./globals.css";
import { SearchProvider } from "@/lib/SearchContext";
import { CartProvider } from "@/lib/CartContext";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Straver Pflanzen Export",
  description: "Planten en artikelen van Straver Pflanzen Export",
  icons: {
    icon: '/icon.png',
  },
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <SearchProvider>
          <CartProvider>
            <FavoritesProvider>
              <LanguageProvider>
                {children}
                <ScrollToTop />
              </LanguageProvider>
            </FavoritesProvider>
          </CartProvider>
        </SearchProvider>
      </body>
    </html>
  );
}

