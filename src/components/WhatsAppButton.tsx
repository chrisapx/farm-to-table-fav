import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "256784964625";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I'd%20like%20to%20place%20an%20order.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[hsl(145,55%,32%)] px-5 py-3 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}
