import { BookOpen, Heart, Users, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import heroImage from "@/assets/hero2.jpg";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeInView } from "@/components/ui/FadeInView";

/**
 * Chi Siamo Page
 * Storia e missione dell'associazione
 */
const ChiSiamo = () => {
  const values = [
    {
      icon: Heart,
      title: "Solidarietà",
      description: "Un impegno concreto verso chi soffre, seguendo l'esempio di amore incondizionato di Don Mario.",
    },
    {
      icon: Users,
      title: "Servizio",
      description: "Dedizione totale alla comunità, mettendo sempre al centro i bisogni degli ultimi.",
    },
    {
      icon: Scale,
      title: "Giustizia",
      description: "Promozione dei diritti umani e della dignità per ogni persona, ovunque si trovi.",
    },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Articoli e Pubblicazioni",
      description: "Scopri i libri, gli articoli e i materiali didattici che raccontano la vita straordinaria di Don Mario.",
      path: "/articoli",
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Chi Siamo"
        description="La storia dell'Associazione Amici di Don Mario Gerlin: dal 1994, portiamo avanti l'eredità di amore e servizio del missionario trevigiano."
      />
      <Header />
      <main>
        {/* Hero Section with Parallax Effect */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
            style={{
              backgroundImage: `url(${heroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4 animate-scale-in">
              Dal 1994
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up tracking-tight">
              Chi Siamo
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto animate-slide-up leading-relaxed font-light">
              Custodi di una storia preziosa, costruttori di un futuro solidale.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-chi" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-secondary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-chi)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
              {/* Text Content */}
              <FadeInView direction="left" delay={0.1}>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 leading-tight font-display">
                    Una storia di fede e <span className="text-secondary font-display">dedizione</span>
                  </h2>
                  <div className="prose prose-lg text-muted-foreground">
                    <p className="mb-6 leading-relaxed">
                      <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-secondary opacity-80">F</span>
                      ondata nel <strong>giugno 1994</strong>, l'Associazione Amici di Don Mario Gerlin
                      nasce con uno scopo nobile: preservare e diffondere l'opera del missionario trevigiano.
                      Una figura che ha segnato profondamente chiunque lo abbia incontrato, testimone autentico di
                      fede incrollabile, impegno sociale attivo e amore smisurato per gli ultimi.
                    </p>
                    <p className="leading-relaxed">
                      Don Mario Gerlin, nato a Pieve di Soligo, non è stato solo un sacerdote, ma un uomo poliedrico:
                      educatore appassionato, sindaco amato della sua città negli anni '60, e infine missionario
                      in Brasile. Lì, a Bambuí, ha donato tutto se stesso per i malati di lebbra, diventando
                      un faro di speranza in una realtà di emarginazione.
                    </p>
                  </div>
                </div>
              </FadeInView>

              {/* Image */}
              <FadeInView direction="right" delay={0.2}>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-[2rem] blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50">
                    <img
                      src={heroImage}
                      alt="Storia dell'associazione"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              </FadeInView>
            </div>

            {/* Values Section */}
            <div className="mb-24">
              <FadeInView delay={0.1}>
                <SectionTitle
                  title="I Nostri Valori"
                  subtitle="I principi che guidano ogni nostra azione quotidiana"
                  label="Fondamenta"
                />
              </FadeInView>

              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <FadeInView key={index} delay={index * 0.15}>
                    <div
                      className="p-8 rounded-3xl card-premium group text-center h-full cursor-pointer"
                    >
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-gold shadow-gold 
                                    flex items-center justify-center group-hover:scale-110 
                                    transition-transform duration-300 transform rotate-3 group-hover:rotate-0">
                        <value.icon className="text-primary-foreground" size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </FadeInView>
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div>
              <FadeInView delay={0.1}>
                <SectionTitle
                  title="Approfondisci"
                  subtitle="Scopri di più sulla nostra attività"
                  label="Scopri"
                />
              </FadeInView>
              <div className="max-w-2xl mx-auto">
                {features.map((feature, index) => (
                  <FadeInView key={index} delay={0.2}>
                    <Link
                      to={feature.path}
                      className="flex items-center gap-6 p-6 card-premium group block cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary/10 text-secondary
                                    flex items-center justify-center group-hover:bg-secondary group-hover:text-white
                                    transition-all duration-300">
                        <feature.icon size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                      <div className="ml-auto text-secondary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                        →
                      </div>
                    </Link>
                  </FadeInView>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ChiSiamo;
