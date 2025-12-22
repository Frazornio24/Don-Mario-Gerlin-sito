import { Download, FileText, Newspaper, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/**
 * Stampa Page
 * Rassegna stampa e documenti
 */
const Stampa = () => {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [customDocs, setCustomDocs] = useState<any[]>([]);

  // Load custom docs from admin panel
  // Load custom docs from Supabase
  useEffect(() => {
    const fetchDocs = async () => {
      const { data } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const mapped = data.map((d) => ({
          ...d,
          icon: FileText,
          size: "Documento Caricato"
        }));
        setCustomDocs(mapped);
      }
    };
    fetchDocs();
  }, []);

  const staticDocuments = [
    {
      icon: Newspaper,
      title: "Don Gerlin Nelle Scuole",
      description: "Articolo da 'L'Azione' (2019)",
      size: "312 KB - PDF",
      url: "/documents/2019DonGerlinNelleScuoleAzione.pdf",
    },
    {
      icon: Newspaper,
      title: "Premio Toniolo - Gazzettino",
      description: "Articolo da 'Il Gazzettino' (2019)",
      size: "89 KB - PDF",
      url: "/documents/2019PremioTonioloGazzettino.pdf",
    },
    {
      icon: Newspaper,
      title: "Premio Toniolo - Tribuna",
      description: "Articolo da 'La Tribuna' (2019)",
      size: "180 KB - PDF",
      url: "/documents/2019PremioTonioloTribuna.pdf",
    },
    {
      icon: Newspaper,
      title: "Articolo Bracelli",
      description: "Archivio 2018",
      size: "144 KB - PDF",
      url: "/documents/2018bracelli.pdf",
    },
    {
      icon: Newspaper,
      title: "L'Azione",
      description: "Archivio 2013",
      size: "408 KB - PDF",
      url: "/documents/2013lazione.pdf",
    },
    {
      icon: Newspaper,
      title: "L'Azione",
      description: "Archivio 2010",
      size: "348 KB - PDF",
      url: "/documents/2010lazione.pdf",
    },
    {
      icon: Newspaper,
      title: "Monte Calvario",
      description: "Archivio 2010",
      size: "656 KB - PDF",
      url: "/documents/2010montecalvario.pdf",
    },
    {
      icon: Newspaper,
      title: "La Nostra Pieve",
      description: "Archivio 2009",
      size: "1.0 MB - PDF",
      url: "/documents/2009lanostrapieve.pdf",
    },
    {
      icon: Newspaper,
      title: "La Sorgente",
      description: "Archivio 2002",
      size: "815 KB - PDF",
      url: "/documents/2002lasorgente.pdf",
    },
    {
      icon: Newspaper,
      title: "Mosaico",
      description: "Archivio 1965",
      size: "814 KB - PDF",
      url: "/documents/1965mosaico.pdf",
    },
  ];

  const documents = [...customDocs, ...staticDocuments];

  const articles = [
    {
      source: "QdP News",
      date: "27 Febbraio 2023",
      title: "30° Anniversario della Morte",
      description:
        "\"Italia e Brasile uniti nel ricordo di Don Mario Gerlin - Messa solenne con il Vescovo nell'Arcipretale diventata Duomo\"",
      tags: ["Commemorazione", "Trentennale"],
      url: "https://www.qdpnews.it/comuni/pieve-di-soligo/italia-e-brasile-uniti-nel-trentennale-della-morte-di-don-mario-gerlin-messa-con-il-vescovo-nellarcipretale-diventata-duomo-20-anni-fa/",
    },
    {
      source: "Treviso Today",
      date: "15 Settembre 2022",
      title: "Borse di Studio Internazionali",
      description:
        "\"Gemellaggio educativo tra Pieve di Soligo e Bambuí: nuove opportunità per gli studenti grazie all'eredità di Don Mario\"",
      tags: ["Educazione", "Gemellaggio"],
      url: "https://www.trevisotoday.it/scuola/borse-studio-gemellaggio-don-mario-gerlin-pieve-di-soligo-.html",
    },
    {
      source: "QdP News",
      date: "27 Ottobre 2022",
      title: "103° Anniversario della Nascita",
      description:
        "\"Celebrazioni internazionali per Don Mario Gerlin con ospiti d'eccezione: soprano giapponese dalla Fenice di Venezia\"",
      tags: ["Anniversario", "Musica"],
      url: "https://www.qdpnews.it/comuni/pieve-di-soligo/103-anni-fa-nasceva-don-mario-gerlin-domani-sera-in-duomo-la-messa-in-suo-ricordo-ospite-deccezione-un-soprano-giapponese-dalla-fenice-di-venezia/",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-light to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-primary-foreground mb-6 animate-slide-up">Rassegna Stampa</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
              L'eredità di Don Mario attraverso i media e la documentazione storica
            </p>
          </div>
        </section>

        {/* Documents Section */}
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" width="100%" height="100%">
              <pattern id="pattern-circles-stampa" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="currentColor" className="text-secondary" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles-stampa)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-primary">Archivio Documentale</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Raccolta completa di documenti, articoli e pubblicazioni su Don Mario Gerlin
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPdf(doc.url)}
                  className="p-8 rounded-3xl bg-card hover:shadow-elegant transition-all duration-500 
                           group border-2 border-border hover:border-secondary animate-scale-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center 
                              mb-6 group-hover:scale-110 transition-transform duration-300 shadow-gold"
                  >
                    <doc.icon className="text-primary-foreground" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{doc.title}</h3>
                  <p className="text-muted-foreground mb-4">{doc.description}</p>
                  <p className="text-sm text-muted-foreground/70 mb-6">{doc.size}</p>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-secondary hover:bg-secondary hover:text-primary-foreground"
                    asChild
                  >
                    <a href={doc.url} download onClick={(e) => e.stopPropagation()}>
                      <Download size={18} className="mr-2" />
                      Scarica
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="mb-4 text-primary">Articoli Online Recenti</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Collegamenti diretti agli articoli più significativi pubblicati sui media locali
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className="p-8 rounded-3xl bg-card hover:shadow-elegant transition-all duration-500 
                           border-2 border-border hover:border-secondary group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-secondary">{article.source}</span>
                    <time className="text-sm text-muted-foreground">{article.date}</time>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{article.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {article.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-secondary hover:text-secondary/80 
                             font-semibold transition-colors group"
                  >
                    Leggi l'articolo completo
                    <TrendingUp size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <Dialog open={!!selectedPdf} onOpenChange={(open) => !open && setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Anteprima Documento</DialogTitle>
            <DialogDescription>
              Visualizzazione anteprima del documento
            </DialogDescription>
          </DialogHeader>
          {selectedPdf && (
            <iframe src={selectedPdf} className="w-full h-full rounded-md" title="PDF Preview" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stampa;
