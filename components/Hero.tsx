import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function Hero() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background z-10"></div>
        <div className="absolute inset-0 bg-black/10 z-10"></div>
        <video
          src="/rtwebsite.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* <iframe
          src="https://www.youtube.com/embed/lBw7wtSvs-A?autoplay=1&mute=1&controls=0&loop=1&playlist=lBw7wtSvs-A&modestbranding=1&showinfo=0&rel=0"
          className="w-full h-full object-cover pointer-events-none"
          allow="autoplay"
        ></iframe> */}

      </div>

      {/* Content */}
      <div className="container relative z-20 text-center px-4 ">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl lg:text-[65px] font-black text-gray-300 mb-6 tracking-tight drop-shadow-2xl">
            <span className="block font-heading">Respect | ريسبكت</span>
          </h1>

          <h4 className="text-lg md:text-[28px] text-white/90 mb-10 font-bold leading-relaxed max-w -7xl mx-auto  drop-shadow-md">
            حياكم الله في سيرفر ريسبكت المتخصص في الرول بلاي نحاول جاهدين تقديم افضل تجربه للرول بلاي في الشرق الاوسط انضم الينا الان و عيش حياتك كما تريد
          </h4>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className=" text-lg px-4 py-4 font-bold h-auto min-w-[200px] text-white border-white/30 hover:border-primary/20  hover:bg-primary backdrop-blur-sm"
                asChild
              >
                <Link to={isAuthenticated ? "/store" : "/signin"}>
                  {isAuthenticated ? "أذهب الى المتجر" : "تسجيل الدخول"}
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20"></div>
    </section>
  );
}
