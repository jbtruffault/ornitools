import type { Metadata } from 'next';
import { Suspense } from "react"
import localFont from 'next/font/local';
import './globals.css';
//import "leaflet/dist/leaflet.css";
//import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { Providers } from '@/components/providers';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Ornitools',
  description: "Un outil de suivi de positions GPS d'oiseaux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense 
          fallback={
            <div className="flex h-screen w-screen items-center justify-center pt-4">
              <div className="text-center">
                <LoadingSpinner />
              </div>
            </div>
          }>
          <Providers>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
