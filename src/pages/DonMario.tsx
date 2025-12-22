import { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Don Mario Page
 * Biografia con timeline della vita del missionario
 */
const DonMario = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  const timelineEvents = [
    {
      date: "1919",
      title: "Nascita a Pieve di Soligo",
      description:
        "Don Mario Gerlin nasce il 27 ottobre 1919 a Pieve di Soligo (TV), in una famiglia di umili origini. Durante la sua giovinezza, affronta gravi dolori familiari: tre suoi fratelli sono colpiti da una rara forma di paralisi progressiva, che li porta alla morte attorno ai quarant'anni. Queste sofferenze lo allontanano temporaneamente dalla fede.",
    },
    {
      date: "1940-1946",
      title: "Partecipazione alla Seconda Guerra Mondiale",
      description:
        "Dal 1940 al 1946, Don Mario partecipa alla Seconda Guerra Mondiale. Al ritorno a casa, si dedica all'insegnamento elementare.",
    },
    {
      date: "1957",
      title: "Ritorno alla fede",
      description:
        "Nel 1957, Don Mario ritrova la fede perduta in giovinezza. Questo evento segna l'inizio di un nuovo percorso spirituale che lo porterà a dedicarsi completamente al servizio degli altri.",
    },
    {
      date: "1960-1969",
      title: "Sindaco di Pieve di Soligo",
      description:
        "Dal 1960 al 1969, Don Mario è sindaco del suo paese natale, Pieve di Soligo. Durante il suo mandato, si impegna per l'educazione e la crescita dei giovani, promuovendo iniziative a favore della comunità.",
    },
    {
      date: "1969",
      title: "Ordinazione sacerdotale",
      description:
        "Nel dicembre del 1969, Don Mario è ordinato sacerdote da Mons. Albino Luciani, futuro Papa Giovanni Paolo I. Questo passo rappresenta la realizzazione della sua vocazione religiosa.",
    },
    {
      date: "1970-1972",
      title: "Missione in Burundi",
      description:
        "Dal 1970 al 1972, Don Mario è missionario in Burundi, nella diocesi di Muyinga. Durante questo periodo, si dedica all'assistenza dei più bisognosi, portando conforto e aiuto alle comunità locali.",
    },
    {
      date: "1974",
      title: "Missione in Brasile",
      description:
        "Nel 1974, Don Mario parte per il Brasile, dove dedica tutta la sua vita agli hanseniani (malati di lebbra). Opera inizialmente a Marituba (Amapà), poi a Belo Horizonte e infine a Bambuí (Minas Gerais). Qui si impegna nella cura dei malati e nella promozione di strutture sanitarie adeguate.",
    },
    {
      date: "1993",
      title: "Morte a Bambuí",
      description:
        "Don Mario muore il 27 febbraio 1993 a Bambuí, dove è sepolto tra coloro che aveva servito con amore. La sua dedizione ai più emarginati gli vale il soprannome di \"l'angelo dei lebbrosi\".",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-light to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-primary-foreground mb-6 animate-slide-up">Don Mario Gerlin</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
              1919-1993 • Apostolo dei lebbrosi
            </p>
          </div>
        </section>

        {/* Timeline Section */}
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/30 transform md:-translate-x-1/2" />

              {/* Timeline Items */}
              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`relative mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}>
                    {/* Date Side */}
                    <div className={`flex items-center gap-4 md:w-1/2 ${index % 2 === 1 ? "md:justify-start md:pl-12" : "md:justify-end md:pr-12"
                      }`}>
                      <div className={`hidden md:block flex-1 ${index % 2 === 1 ? "text-left" : "text-right"
                        }`}>
                        <span className="text-2xl font-bold text-secondary">{event.date}</span>
                      </div>

                      <div
                        className="relative z-10 flex items-center justify-center w-16 h-16 
                                  rounded-2xl gradient-gold shadow-gold group-hover:scale-110 
                                  transition-transform duration-300 flex-shrink-0"
                      >
                        <Calendar className="text-primary-foreground" size={28} />
                      </div>

                      <div className={`md:hidden flex-1`}>
                        <span className="text-2xl font-bold text-secondary">{event.date}</span>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`md:w-1/2 ${index % 2 === 1 ? "md:pr-12" : "md:pl-12"
                      }`}>
                      <div
                        className="p-6 rounded-2xl bg-card border-2 border-border 
                                  hover:border-secondary hover:shadow-elegant transition-all duration-300"
                      >
                        <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      </div>
                    </div>
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

export default DonMario;
