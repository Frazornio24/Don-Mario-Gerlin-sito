import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, Mail, Home, MapPin } from "lucide-react";

const PageOverviewSection = () => {
  const pageDescriptions = [
    {
      icon: Home,
      title: "Home",
      description: "Presentazione generale dell'associazione e missione.",
      path: "/",
    },
    {
      icon: Users,
      title: "Chi Siamo",
      description: "Storia dell'associazione e vita di Don Mario Gerlin.",
      path: "/chi-siamo",
    },
    {
      icon: BookOpen,
      title: "Articoli",
      description: "Libri, articoli e materiali sulla vita di Don Mario.",
      path: "/articoli",
    },
    {
      icon: MapPin,
      title: "Bambuí",
      description: "Paese brasiliano visitato da Don Mario.",
      path: "/bambui",
    },
    {
      icon: Mail,
      title: "Contatti",
      description: "Informazioni per contattarci e unirti.",
      path: "/contatti",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-16 animate-slide-up">
          Esplora le Nostre Sezioni
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageDescriptions.map((page, index) => (
            <Link
              key={index}
              to={page.path}
              className="group relative p-8 rounded-3xl bg-card border-2 border-border 
                       hover:border-secondary hover:shadow-elegant transition-all duration-500 
                       flex flex-col overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 
                         transition-opacity duration-500 transform translate-x-4 -translate-y-4"
              >
                <page.icon size={120} />
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl gradient-gold 
                                flex items-center justify-center group-hover:scale-110 
                                transition-transform duration-300 shadow-gold z-10"
                >
                  <page.icon className="text-primary-foreground" size={32} />
                </div>
                <div className="z-10">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                    {page.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {page.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center text-secondary font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                Esplora
                <div className="ml-2 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PageOverviewSection;