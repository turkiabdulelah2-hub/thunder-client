import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black/40 border-t border-white/5 py-8 mt-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/5 blur-[100px] pointer-events-none"></div>

      <div className="container flex flex-col md:flex-row items-center justify-center  gap-4 relative z-10">
        <div className="text-sm  text-center">
          <p>حقوق الطبع والنشر © 2025 Respect CFW. جميع الحقوق محفوظة</p>
         
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 rounded-full border-primary/30 hover:bg-primary/20 hover:border-primary text-primary transition-all duration-300 group shadow-lg z-50"
        >
          <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </footer>
  );
}
