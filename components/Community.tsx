import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Scale, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function Community() {
  const cards = [
    {
      icon: <Info className="w-10 h-10 text-primary" />,
      title: "من نحن",
      description: '"ريسبكت" هو سيرفر فايف إم مخصص للاعبين العرب، تأسس في عام 2020 بهدف تقديم تجربة لعب استثنائية.',
      buttonText: "اكتشف المزيد",
      delay: 0.1
    },
    {
      icon: <Scale className="w-10 h-10 text-primary" />,
      title: "القوانين",
      description: "القوانين تهدف إلى ضمان المتعة والاحترام بين اللاعبين، مع تنظيم سير اللعبة بطريقة عادلة وشفافة.",
      buttonText: "الاطلاع على القوانين",
      delay: 0.2
    },
    {
      icon: <Headphones className="w-10 h-10 text-primary" />,
      title: "اتصل بنا",
      description: "يمكنك التواصل معنا عن طريق جميع منصات التواصل الاجتماعي سواء الدسكورد او التويتر",
      buttonText: "الدخول إلى الديسكورد",
      delay: 0.3
    }
  ];

  return (
    <section className="py-24 relative bg-[#120033] overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/community-bg.jpg')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading"
          >
            مجتمع ريسبكت
          </motion.h2>
          <p className=" text-lg leading-relaxed " style={{ lineHeight: 1.2 }}>
            مجتمع سيرفر "ريسبكت" العربي هو مجتمع حيوي يجمع بين اللاعبين والمؤثرين والمشاهدين، مما يخلق بيئة تفاعلية وغنية. يشارك اللاعبون في بناء تجارب مميزة داخل السيرفر، بينما يسهم المؤثرون والاستريمرز في نشر المتعة والإثارة عبر البث المباشر، مما يعزز التفاعل والتواصل بين اللاعبين والجماهير. المتابعون يتفاعلون بشكل مستمر، ويشاركون في الفعاليات والمسابقات، مما يعزز روح التعاون والتأثير داخل مجتمع "ريسبكت" الذي يعكس قوة وتأثير هذا التجمع.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-32  ">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay }}
            >
              <Card className="bg-[#19093a] boarder-0 backdrop-blur-sm border-primary/10 hover:border-primary/50 transition-all duration-300 h-full group">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="mb-6 p-4  rounded-full group-hover:bg-primary/20 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 font-heading">{card.title}</h3>
                  <p className=" mb-8 flex-grow">
                    {card.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-0 font-black text-white hover:border-primary hover:text-primary"
                  >
                    {card.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
