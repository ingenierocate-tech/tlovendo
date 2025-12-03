import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  return (
    <html lang="es">
      <body className="bg-white text-gray-900 antialiased font-body">
        {/* Header global */}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat phone={whatsappPhone} />
      </body>
    </html>
  );
}