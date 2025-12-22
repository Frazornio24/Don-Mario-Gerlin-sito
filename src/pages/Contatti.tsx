import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Contatti Page
 * Form di contatto e informazioni
 */
const Contatti = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Messaggio inviato!",
      description: "Ti risponderemo al più presto.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Indirizzo",
      content: "Piazza Libertà, 7\n31050 Solighetto (TV)",
    },
    {
      icon: Phone,
      title: "Telefono",
      content: "+39 0438 940249",
      link: "tel:+390438940249",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@donmariogerlin.org",
      link: "mailto:info@donmariogerlin.org",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-light to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-primary-foreground mb-6 animate-slide-up">Contatti</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
              Siamo qui per rispondere alle tue domande
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-contatti" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-secondary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-contatti)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Info */}
              <div className="space-y-8">
                <h2 className="text-primary mb-8">Informazioni</h2>
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6 p-6 rounded-2xl bg-card hover:shadow-md 
                             transition-all duration-300 group border-2 border-border hover:border-secondary"
                  >
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-xl gradient-gold 
                                flex items-center justify-center group-hover:scale-110 
                                transition-transform duration-300 shadow-gold"
                    >
                      <info.icon className="text-primary-foreground" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-muted-foreground hover:text-secondary transition-colors whitespace-pre-line"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-primary mb-8">Scrivici</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-14 text-lg rounded-xl border-2 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-14 text-lg rounded-xl border-2 focus:border-secondary"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Il tuo messaggio"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="text-lg rounded-xl border-2 focus:border-secondary resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-gold hover:scale-105 hover:shadow-gold 
                             transition-all duration-300 text-lg py-6 rounded-xl font-semibold group"
                  >
                    Invia messaggio
                    <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contatti;
