import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GTA6News - Twoje źródło informacji o Grand Theft Auto VI',
  description: 'Najnowsze artykuły, newsy, gameplay i plotki o GTA 6. Ponieważ GTA VI zmieni graczy na zawsze.',
  metadataBase: new URL('https://gta6news.pl'),
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://gta6news.pl',
    siteName: 'GTA6News',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
