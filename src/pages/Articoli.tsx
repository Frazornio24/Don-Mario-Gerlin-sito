import { Download, FileText, Newspaper, TrendingUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import hero3Img from "@/assets/hero3.jpg";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { FadeInView } from "@/components/ui/FadeInView";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

/**
 * Articoli Page
 * Rassegna stampa e documenti
 */
const Articoli = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

  // Load custom docs and online articles from Supabase
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
          size: "Documento PDF"
        }));
        setDocuments(mapped);
      }
    };

    const fetchArticles = async () => {
      const { data } = await supabase
        .from('online_articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setArticles(data);
      }
    };

    fetchDocs();
    fetchArticles();
  }, []);

  const handlePrev = useCallback(() => {
    setSelectedDocIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? documents.length - 1 : prev - 1;
    });
  }, [documents.length]);

  const handleNext = useCallback(() => {
    setSelectedDocIndex((prev) => {
      if (prev === null) return null;
      return prev === documents.length - 1 ? 0 : prev + 1;
    });
  }, [documents.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedDocIndex === null) return;
      
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDocIndex, handleNext, handlePrev]);

  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const selectedDoc = selectedDocIndex !== null ? documents[selectedDocIndex] : null;

  return (
    <div className="min-h-screen">
      <SEO
        title="Articoli e Documenti"
        description="Archivio completo di articoli, pubblicazioni e documenti storici su Don Mario Gerlin e le attività dell'associazione."
      />
      <Header />
      <main className="pt-20">
        <HeroSection
          title="Articoli e Documenti"
          subtitle="L'eredità di Don Mario attraverso i media e la documentazione storica"
          backgroundImage={hero3Img}
        />

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
                  onClick={() => setSelectedDocIndex(index)}
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

      <Dialog open={selectedDocIndex !== null} onOpenChange={(open) => !open && setSelectedDocIndex(null)}>
        <DialogContent 
           className="max-w-7xl w-full h-[90vh] bg-background border-none shadow-2xl p-0 flex flex-col overflow-hidden [&>button]:hidden text-foreground"
           onTouchStart={onTouchStart}
           onTouchMove={onTouchMove}
           onTouchEnd={onTouchEnd}
        >
          {/* Header/Close Bar */}
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
             <DialogTitle className="text-lg font-semibold truncate flex-1 pr-4">
                {selectedDoc?.title}
             </DialogTitle>
             <div className="flex items-center gap-2">
               {selectedDocIndex !== null && (
                 <span className="text-sm text-muted-foreground mr-2">
                   {selectedDocIndex + 1} / {documents.length}
                 </span>
               )}
               <DialogClose className="rounded-full bg-muted hover:bg-muted/80 p-2 transition-colors">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
               </DialogClose>
             </div>
          </div>

          <div className="flex-1 relative bg-neutral-100 w-full h-full overflow-hidden">
            {/* Left Button */}
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 handlePrev();
               }}
               className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 
                          bg-white/80 hover:bg-white shadow-md p-2 rounded-full 
                          text-primary transition-all duration-300"
               aria-label="Previous document"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

             {/* Right Button */}
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 handleNext();
               }}
               className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 
                          bg-white/80 hover:bg-white shadow-md p-2 rounded-full 
                          text-primary transition-all duration-300"
               aria-label="Next document"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* PDF Viewer */}
            {selectedDoc && (
              <iframe 
                src={selectedDoc.url} 
                className="w-full h-full border-none" 
                title={selectedDoc.title} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Articoli;
