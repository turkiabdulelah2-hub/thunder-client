import { motion } from "framer-motion";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import StreamerGrid from "./StreamerGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BackgroundAnimation = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute inset-0 bg-[#120033] opacity-90" />
    <div className="absolute inset-0 opacity-10">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32"
          style={{
            left: `${(i % 5) * 20 + Math.random() * 10}%`,
            top: `${Math.floor(i / 5) * 25 + Math.random() * 10}%`,
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <img
            src="/images/shapes-bg.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </div>
  </div>
);

export default function Streamers() {
  const { streamers, loading, error, fetchStreamers } = useUserStore();

  useEffect(() => {
    fetchStreamers();
  }, []); // Only fetch once on mount

  return (
    <section id="streamers" className="py-20 relative overflow-hidden">
      <BackgroundAnimation />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-heading">
            شاهد أفضل البثوث
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
            تابع أفضل البثوث المباشرة لأحداث مميزة في مختلف المجالات
          </p>
        </motion.div>

        <StreamerGrid
          streamers={streamers}
          loading={loading}
          error={error}
          maxItems={6}
          columns={{ sm: 2, md: 3, lg: 5 }}
          cardSize="md"
        />

        <div className="mt-12 text-center">
          <Button asChild size="lg" className="rounded-full px-8 btn-neon">
            <Link to="/streamers">
              View All Streamers
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none z-0" />
    </section>
  );
}
