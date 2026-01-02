import { motion } from "framer-motion";

export default function Social() {
  return (
    <section className="py-52 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(/images/image.png)' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-right order-2 lg:order-1">
            <motion.h2
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-white mb-6 font-heading"
            >
              منصات التواصل
            </motion.h2>

            <p className="text-white/80 text-lg leadi ng-relaxed mb-10 max-w-xl  " style={{ lineHeight:1.2}}>
              مجتمع سيرفر "ريسبكت" يمتلك حضورًا قويًا على منصات التواصل الاجتماعي، حيث يعد من الأكبر في العالم. على "ديسكورد" و " التويتر " كعدد متابعين ولاعبين ، وهو السيرفر العربي الاول على العالم يتم تخصيص له قسم خاص في منصة البثوث الشهيرة كيك دوت كوم .
            </p>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 " style={{ direction: "rtl" }}>200k+</h3>
                <p className="text-white/60 font-semibold">مجموع الاعضاء</p>
              </div>
              <div className="text-center border-r-2 border-white">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2" style={{ direction: "rtl" }}>170k+</h3>
                <p className="text-white/60 font-semibold">مجموع المتابعين</p>
              </div>
              <div className="text-center border-r-2 border-white">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2" style={{ direction: "rtl" }}>60k+</h3>
                <p className="text-white/60 font-semibold">مجتمع تويتر</p>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          <div className="relative order-1 lg:order-2">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
              {/* Right Image (spans 2 rows) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl row-span-2 p-5 group   "
              >
                <img
                  src="/images/crafter-1.png"
                  alt="Social 2"
                  className="w-full h-full object-cover   transition-all duration-500"
                />
              </motion.div>

              {/* Bottom Left Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-2xl p-5 group  "
              >
                <img
                  src="/images/crafter-2.png"
                  alt="Social 3"
                  className="w-full h-full object-cover   transition-all duration-500"
                />
              </motion.div>

              {/* Top Left Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl p-5 group  "
              >
                <img
                  src="/images/crafter-3.png"
                  alt="Social 1"
                  className="w-full h-full object-cover   transition-all duration-500"
                />
              </motion.div>
            </div>

            {/* Floating Text Labels */}
            <div
              className="absolute -top-5 right-40 pointer-events-none z-10"
              style={{
                animation: 'floatSlow 6s ease-in-out infinite',
              }}
            >
              <span
                className="text-6xl md:text-7xl font-bold font-heading transition-all duration-500"
                style={{
                  WebkitTextStroke: '1px #ffffff',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                كيك
              </span>
            </div>

            <div
              className="absolute bottom-0 left-8 pointer-events-none z-10"
              style={{
                animation: 'floatMedium 5s ease-in-out 1s infinite',
              }}
            >
              <span
                className="text-6xl md:text-7xl font-bold font-heading transition-all duration-500"
                style={{
                  WebkitTextStroke: '1px #ffffff',
                  WebkitTextFillColor: 'transparent',
                }}
              >تويتر

              </span>
            </div>

            <div
              className="absolute top-40 left-12 pointer-events-none z-10"
              style={{
                animation: 'floatFast 7s ease-in-out 0.5s infinite',
              }}
            >
              <span
                className="text-6xl md:text-7xl font-bold font-heading transition-all duration-500"
                style={{
                  WebkitTextStroke: '1px #ffffff',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                دسكورد
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes floatMedium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </section>
  );
}
