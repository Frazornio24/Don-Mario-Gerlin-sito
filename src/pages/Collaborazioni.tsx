import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Users, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import collabsHero from "@/assets/hero1.jpg";

/**
 * Collaborazioni Page
 * Link a pagine Facebook e altre collaborazioni
 */
const Collaborazioni = () => {
  const [collaborations, setCollaborations] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollabs = async () => {
      const { data } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) {
        setCollaborations(data);
      }
    };
    fetchCollabs();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Collaborazioni"
        description="Scopri le nostre collaborazioni e i legami con la comunità in Brasile."
      />
      <Header />
      <main className="pt-20">
        <HeroSection
          title="Collaborazioni"
          subtitle="I nostri legami e le attività con la comunità in Brasile"
          backgroundImage={collabsHero}
        />

        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
            </svg>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-primary mb-4">Le Nostre Pagine Amiche</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Visita le pagine delle nostre collaborazioni in Brasile per rimanere sempre aggiornato sulle loro iniziative.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {collaborations.map((link, index) => (
                <div 
                  key={link.id || index}
                  className="p-8 rounded-3xl bg-card border-2 border-border hover:border-secondary hover:shadow-elegant transition-all duration-300 flex flex-col h-full overflow-hidden"
                >
                  {link.image_url ? (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-border bg-muted">
                      <img 
                        src={link.image_url} 
                        alt={link.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-6 shadow-gold">
                      <Users className="text-primary-foreground" size={28} />
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-foreground mb-3">{link.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                    {link.description}
                  </p>

                  <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-border/60">
                    {link.attachment_url && (
                      <a 
                        href={link.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-secondary font-semibold hover:underline"
                      >
                        <FileText className="mr-1.5 w-4 h-4 flex-shrink-0" />
                        Scarica Allegato (PDF)
                      </a>
                    )}
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-secondary font-semibold hover:text-primary transition-colors group"
                    >
                      Visita la pagina
                      <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collaborazioni;
