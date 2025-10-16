import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloatWrapper from '@/components/WhatsAppFloatWrapper';

export const metadata: Metadata = {
  title: 'TLoVendo',
  description: 'Compra y venta de autos usados en Chile',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloatWrapper />
      </body>
    </html>
  );
}