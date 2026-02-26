import { useEffect, useRef, useState } from "react";
import { GraduationCap, Heart, Users, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Mission Section Component
 * Sezione con video YouTube e missione dell'associazione
 */
const MissionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer per animazioni scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Progetti Educativi in Brasile",
      description: "Sosteniamo l'educazione e la formazione delle nuove generazioni",
      path: "/bambui",
    },
    {
      icon: BookOpen,
      title: "Diffondiamo la vita di Don Mario",
      description: "Promuoviamo la conoscenza della figura e delle opere del nostro fondatore",
      path: "/don-mario",
    },
    {
      icon: Heart,
      title: "Iniziative di Sensibilizzazione",
      description: "Diffondiamo i valori di solidarietà e compassione",
      path: "/chi-siamo",
    },
    {
      icon: Users,
      title: "Articoli e Documenti",
      description: "Documentazione storica e rassegna stampa",
      path: "/articoli",
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Mission Content */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="mb-6 text-primary">La Nostra Missione</h2>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Continua l'opera di Don Mario attraverso progetti concreti che portano
              speranza e opportunità alle comunità che ne hanno più bisogno.
            </p>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12 text-left">
              {features.map((feature, index) => (
                <Link
                  key={index}
                  to={feature.path}
                  className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 rounded-2xl bg-card hover:bg-muted/50 
                            transition-all duration-300 hover:shadow-md group block border border-border
                            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                  style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl gradient-gold 
                                flex items-center justify-center group-hover:scale-110 
                                transition-transform duration-300 shadow-gold">
                    <feature.icon className="text-primary-foreground" size={24} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gradient-primary text-primary-foreground border-2 border-secondary
                       hover:scale-105 hover:shadow-gold transition-all duration-300 
                       text-lg px-8 py-6 rounded-2xl font-semibold group"
            >
              <Link to="/contatti">
                Unisciti a Noi
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;