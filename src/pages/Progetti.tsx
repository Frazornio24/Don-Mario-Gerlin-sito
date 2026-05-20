import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import { Heart, GraduationCap, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeInView } from "@/components/ui/FadeInView";
import scuolaImg from "@/assets/scuola.jpg";

export function Progetti() {
  const projects = [
    {
      icon: GraduationCap,
      title: "Sostegno Educativo a Bambuí",
      description: "Supportiamo l'istruzione scolastica, l'acquisto di libri e le attività formative per i bambini e i giovani di Bambuí, in Brasile.",
    },
    {
      icon: Heart,
      title: "Assistenza Sanitaria e Sociale",
      description: "Forniamo aiuto concreto per le cure mediche, le terapie e il miglioramento delle condizioni di vita delle famiglie svantaggiate.",
    },
    {
      icon: FileText,
      title: "Archivio Storico Don Mario",
      description: "Raccogliamo, digitalizziamo e rendiamo accessibile la documentazione storica, le lettere e le opere di Don Mario Gerlin.",
    },
  ];

  return (
    <div className="min-h-screen text-lg">
      <SEO
        title="I Nostri Progetti"
        description="Scopri i progetti dell'Associazione Don Mario Gerlin a Bambuí (Brasile) e le attività di solidarietà e sensibilizzazione in Italia."
      />
      <Header />
      <main className="pt-20">
        <HeroSection
          title="I Nostri Progetti"
          subtitle="Opere concrete che portano dignità, istruzione e salute in Brasile e mantengono viva la memoria di Don Mario."
          ctaText="Contattaci"
          ctaLink="/contatti"
          backgroundImage={scuolaImg}
        />

        <section className="py-20 bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-projects" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-projects)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeInView delay={0.1}>
              <SectionTitle
                title="Attività dell'Associazione"
                subtitle="Da oltre 30 anni lavoriamo per dare risposte concrete ai bisogni delle comunità più vulnerabili."
                label="Progetti"
              />
            </FadeInView>

            <div className="grid md:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <FadeInView key={idx} delay={idx * 0.15}>
                  <div
                    className="p-8 card-premium group h-full cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <project.icon size={26} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-serif">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{project.description}</p>
                  </div>
                </FadeInView>
              ))}
            </div>

            <FadeInView delay={0.4}>
              <div className="text-center mt-16">
                <Button asChild size="lg" variant="outline" className="border-secondary text-primary hover:bg-secondary/10 rounded-2xl px-8 h-12">
                  <Link to="/don-mario">
                    La vita di Don Mario <ChevronRight className="ml-1" size={16} />
                  </Link>
                </Button>
              </div>
            </FadeInView>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Progetti;
