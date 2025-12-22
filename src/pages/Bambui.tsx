import { useState, useEffect, useRef } from "react";
import { Calendar, Church, School, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScuolaElementare from "@/assets/scuola.jpg";
import Ospedale from "@/assets/ospedale.jpg";

/**
 * Bambui Page
 * Il cuore della missione brasiliana
 */
const Bambui = () => {
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
      date: "6-7 dicembre 2017",
      title: "Incontro con la Comunità di Bambuí",
      description:
        "Pierina Gerlin e la sua famiglia incontrano Suor Aparecida, Suor Marta e Suor Alberta presso il Centro Sociale di Bambuí, nella Casa Betania, fondata da Don Mario Gerlin nel 1986. Si discute della situazione attuale del Centro dopo la recente scomparsa di Suor Carmela. Durante la visita alle scuole, guidata da Suor Aparecida, colpiscono l'ordine, la luminosità e la funzionalità degli ambienti. Insegnanti e alunni manifestano quanto sia importante per loro l'interesse di persone straniere. La mattina si conclude con danze e canti offerti dai bambini.",
      icon: School,
    },
    {
      date: "7 dicembre 2017",
      title: "Visita all'ospedale e memoria di Don Mario",
      description:
        "Visita all'ospedale dove si nota che alcuni padiglioni necessitano di ristrutturazione, mentre l'ala maschile, le sale operatorie e i locali di sterilizzazione sono ben organizzati. Il personale medico-infermieristico si distingue per calore umano e dedizione. Visita alla casa di Don Mario, ancora piena dei suoi oggetti cari: la macchina da scrivere, il porta-viatico, l'ombrello, il suo angolo di preghiera e il maestoso mango.",
      icon: Heart,
    },
    {
      date: "8 dicembre 2017",
      title: "Inaugurazione della Casa di Riposo \"Recanto Maria Munari\"",
      description:
        "Durante la Messa di inaugurazione, la chiesa è gremita. Un lungo applauso accompagna la famiglia Gerlin lungo la navata. Le immagini di Don Mario e Suor Carmela vengono collocate accanto all'altare. La cerimonia è intensa ed emozionante. Dopo il taglio del nastro: 10 camere doppie con ampi servizi igienici, sale comuni luminose e accoglienti, un giardino esterno curato e suggestivo. Il Centro Sociale di Bambuí si conferma come cuore pulsante del territorio.",
      icon: Church,
    },
    {
      date: "9-10 dicembre 2017",
      title: "Ricordi, preghiere e gratitudine",
      description:
        "Ultimo momento: visita alla cappella del Cimitero del Centro Sociale, dove riposano Don Mario e Suor Carmela. Accanto, una teca con ex voto, un grande libro dei pensieri e molte fotografie e fiori. Pierina ricorda il calore e la disponibilità delle persone incontrate, la loro generosità e spiritualità vissuta con semplicità. Un ringraziamento speciale a Suor Aparecida, Suor Alberta, Suor Marta e agli aiutanti della casa delle suore.",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-light to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-primary-foreground mb-6 animate-slide-up">Bambui</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
              Il cuore della missione brasiliana
            </p>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative rounded-3xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-500 border-4 border-secondary">
                <div className="aspect-[4/3] bg-card">
                  <img
                    src={ScuolaElementare}
                    alt="Scuola a Bambui"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-6">
                  <p className="text-primary-foreground font-semibold text-lg">Scuola elementare</p>
                </div>
              </div>
              <div className="group relative rounded-3xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-500 border-4 border-secondary">
                <div className="aspect-[4/3] bg-card">
                  <img
                    src={Ospedale}
                    alt="Ospedale"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-6">
                  <p className="text-primary-foreground font-semibold text-lg">Struttura ospedaliera</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section ref={sectionRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-bambui" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-bambui)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary/30 transform md:-translate-x-1/2" />

              {timelineEvents.map((event, index) => (
                <div
                  key={index}
                  className={`relative mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}>
                    {/* Date/Icon Side */}
                    <div className={`flex items-center gap-4 md:w-1/2 ${index % 2 === 1 ? "md:justify-start md:pl-12" : "md:justify-end md:pr-12"
                      }`}>
                      <div className={`hidden md:block flex-1 ${index % 2 === 1 ? "text-left" : "text-right"
                        }`}>
                        <span className="text-xl font-bold text-secondary text-right">{event.date}</span>
                      </div>

                      <div
                        className="relative z-10 flex-shrink-0 flex items-center justify-center w-16 h-16 
                                  rounded-2xl gradient-gold shadow-gold hover:scale-110 
                                  transition-transform duration-300"
                      >
                        <event.icon className="text-primary-foreground" size={28} />
                      </div>

                      <div className={`md:hidden flex-1`}>
                        <span className="text-xl font-bold text-secondary">{event.date}</span>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`md:w-1/2 ${index % 2 === 1 ? "md:pr-12" : "md:pl-12"
                      }`}>
                      <div
                        className="p-6 rounded-2xl bg-card border-2 border-border 
                                  hover:border-secondary hover:shadow-elegant transition-all duration-300"
                      >
                        <h3 className="text-xl font-bold text-foreground mb-4">{event.title}</h3>
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

export default Bambui;
