import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { WaveToWhite } from "@/components/ui/SectionDividers";

/**
 * Index Page - Homepage
 * Pagina principale del sito dell'Associazione Don Mario Gerlin
 */
const Index = () => {
  return (
    <div className="min-h-screen text-lg">
      <SEO title="Home - Associazione Don Mario Gerlin" />
      <Header />
      <main>
        <HeroSection />
        <WaveToWhite />
        <MissionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
