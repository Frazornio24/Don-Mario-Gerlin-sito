import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import eventiHero from "@/assets/gallery/missione/messa funebre.jpg";

/**
 * Eventi Page
 * Pagina per gli eventi futuri
 */
const Eventi = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (e) {
        console.error("Error fetching events:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Eventi"
        description="Rimani aggiornato sui prossimi eventi dell'Associazione Amici di Don Mario Gerlin."
      />
      <Header />
      <main className="flex-grow pt-20">
        <HeroSection
          title="Eventi"
          subtitle="Le nostre prossime iniziative e attività"
          backgroundImage={eventiHero}
        />

        <section className="py-20 bg-background relative overflow-hidden min-h-[50vh]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-events" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-events)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-10 w-10 animate-spin border-4 border-secondary border-t-transparent rounded-full" />
                <p className="text-sm text-muted-foreground">Caricamento eventi...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center max-w-2xl mx-auto py-16">
                <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-8">
                  <Calendar className="text-secondary w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Sezione in Aggiornamento</h2>
                <p className="text-xl text-muted-foreground">
                  Al momento non ci sono eventi in programma. Torna a trovarci presto per scoprire le nostre prossime iniziative.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-8 rounded-3xl bg-card border-2 border-border hover:border-secondary hover:shadow-elegant transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center text-primary-foreground shadow-gold">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-primary">{event.title}</h3>
                      {event.date && (
                        <p className="text-sm font-semibold text-secondary">
                          {new Date(event.date).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      )}
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {event.description}
                      </p>
                    </div>

                    {event.attachment_url && (
                      <div className="pt-6 mt-6 border-t border-border/80">
                        <Button
                          variant="outline"
                          className="w-full border-2 border-secondary hover:bg-secondary hover:text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
                          asChild
                        >
                          <a href={event.attachment_url} target="_blank" rel="noopener noreferrer">
                            <Download size={18} />
                            Scarica Allegato / Locandina
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Eventi;
