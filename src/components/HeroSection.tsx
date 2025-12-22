import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";

/**
 * Hero Section Component
 * Slideshow automatico con overlay e call-to-action
 */
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const images = [
    { src: hero1, alt: "Missionario al servizio della comunità" },
    { src: hero2, alt: "Comunità brasiliana unita nella fede" },
    { src: hero3, alt: "Preghiera e speranza" },
  ];

  // Slideshow automatico
  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ${currentImageIndex === index ? "opacity-100" : "opacity-0"
              }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover animate-[slideshow_8s_ease-in-out_infinite_alternate]"
              style={{
                filter: "brightness(0.4) contrast(1.1)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Hero Content */}
      <div
        className={`relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center
          transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <h1 className="text-primary-foreground mb-6 leading-tight animate-slide-up">
          L'eredità di Don Mario Gerlin
        </h1>
        <p
          className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl 
                    leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Un impegno che continua attraverso le generazioni
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 animate-scale-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button
            asChild
            size="lg"
            className="gradient-gold hover:scale-105 hover:shadow-gold transition-all duration-300 
                     text-lg px-8 py-6 rounded-2xl font-semibold group"
          >
            <Link to="/don-mario">
              Scopri la Storia
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>



      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 animate-bounce cursor-pointer p-2"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scorri giù"
      >
        <ChevronDown className="text-white hover:text-secondary transition-colors duration-300 w-12 h-12 drop-shadow-md" />
      </div>
    </section>
  );
};

export default HeroSection;