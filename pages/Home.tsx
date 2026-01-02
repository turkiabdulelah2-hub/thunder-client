import { SEO } from "@/components/SEO/SEO";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Streamers from "@/components/Streamers";
import Social from "@/components/Social";
import Community from "@/components/Community";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SEO
        title="الرئيسية"
        description="مجتمع ريسبكت - أفضل سيرفر فايف ام عربي. انضم إلينا لتجربة لعب واقعية وممتعة مع نخبة من الستريمرز واللاعبين."
        keywords={["ريسبكت", "فايف ام", "GTA V", "RP", "سيرفر عربي", "Respect CFW"]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Respect CFW",
          url: "https://respect-cfw.com",
        }}
      />
      <Hero />
      <Streamers />
      <Social />
      <Community />
    </>
  );
}
