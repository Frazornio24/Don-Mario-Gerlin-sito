import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionSection from "@/components/MissionSection";
import Footer from "@/components/Footer";

/**
 * Index Page - Homepage
 * Pagina principale del sito dell'Associazione Don Mario Gerlin
 */
const Index = () => {
  return (
    <div className="min-h-screen text-lg">
      <Header />
      <main>
        <HeroSection />
        <MissionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
