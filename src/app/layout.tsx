import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  return (
    <html lang="es">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TRWPW11NPK"></script>
        <script>
          {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-TRWPW11NPK');
          `}
        </script>
      </head>
      <body className="bg-white text-gray-900 antialiased font-body">
        {/* Header global */}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat phone={whatsappPhone} />
        <Analytics />
      </body>
    </html>
  );
}