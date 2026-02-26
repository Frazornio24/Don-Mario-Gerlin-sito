import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Users } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
  location?: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Maria Silva",
      role: "Benefattore",
      content: "L'opera di Don Mario Gerlin ha trasformato la nostra comunità. Grazie al suo impegno e all'associazione, molti bambini hanno accesso all'istruzione e cure mediche.",
      rating: 5,
      location: "Bambuí, Brasile"
    },
    {
      id: 2,
      name: "Paolo Rossi",
      role: "Volontario",
      content: "Partecipare a questa missione è stata un'esperienza che ha cambiato la mia vita. vedere l'impatto del nostro lavoro è incredibilmente gratificante.",
      rating: 5,
      location: "Treviso, Italia"
    },
    {
      id: 3,
      name: "Anna Bianchi",
      role: "Sostenitore",
      content: "Seguo l'associazione da anni e sono orgogliosa di poter contribuire a questa nobile causa. Ogni donazione fa la differenza reale.",
      rating: 5,
      location: "Milano, Italia"
    }
  ];

  const stats = [
    { number: "50+", label: "Anni di Missione", icon: "🏆" },
    { number: "1000+", label: "Persone Aiutate", icon: "🤝" },
    { number: "20+", label: "Progetti Attivi", icon: "🌟" },
    { number: "100%", label: "Trasparenza", icon: "✅" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Storie di <span className="text-secondary">Speranza</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Le voci di chi ha vissuto la nostra missione e ha contribuito a rendere speciale il nostro lavoro
          </p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-3xl p-8 md:p-12 shadow-elegant border border-border"
          >
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-secondary" />
                </div>
              </div>
              
              <div className="flex-1">
                {/* Rating Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-foreground">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentTestimonial].role}
                      {testimonials[currentTestimonial].location && (
                        <span> • {testimonials[currentTestimonial].location}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Comunità verificata</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentTestimonial === index 
                    ? 'bg-secondary w-8' 
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Vai alla testimonianza ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold mb-4">
            Unisciti alla Nostra Comunità
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Scopri come puoi contribuire a continuare l'opera di Don Mario Gerlin e fare la differenza nella vita di tante persone.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl gradient-gold text-primary font-semibold hover:scale-105 transition-all duration-300"
            >
              Diventa un Volontario
            </a>
            <a
              href="/contatti"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-primary transition-all duration-300"
            >
              Fai una Donazione
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;