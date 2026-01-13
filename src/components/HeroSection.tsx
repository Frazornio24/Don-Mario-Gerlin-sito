import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";

const HeroSection = () => {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [emblaRef] = useEmblaCarousel({ loop: true, duration: 60 }, [autoplay.current]);

  const images = [
    { src: hero1, alt: "Missionario al servizio della comunità" },
    { src: hero2, alt: "Comunità brasiliana unita nella fede" },
    { src: hero3, alt: "Preghiera e speranza" },
  ];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Embla Carousel Background */}
      <div className="absolute inset-0 z-0 h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div className="relative flex-[0_0_100%] h-full min-w-0" key={index}>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(0.4) contrast(1.1)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Hero Content with Framer Motion */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        <motion.h1
          className="text-primary-foreground mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          L'eredità di Don Mario Gerlin
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Un impegno che continua attraverso le generazioni
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "backOut" }}
          className="flex flex-col sm:flex-row gap-4"
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
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 cursor-pointer p-2"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Scorri giù"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="text-white hover:text-secondary transition-colors duration-300 w-12 h-12 drop-shadow-md" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;