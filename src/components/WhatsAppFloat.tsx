'use client';

interface WhatsAppFloatProps {
  phone?: string;
  text?: string;
}

export default function WhatsAppFloat({ phone, text }: WhatsAppFloatProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_whatsapp', {
        event_category: 'contact',
        event_label: 'whatsapp_float_button',
      });
    }
  };

  const sanitizedPhone = String(phone ?? '').replace(/[^\d]/g, '');
  if (!sanitizedPhone) return null;

  const href = text
    ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${sanitizedPhone}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
      aria-label="WhatsApp"
    >
      💬
    </a>
  );
}