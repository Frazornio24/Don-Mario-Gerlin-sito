import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

/**
 * Foto Page
 * Galleria fotografica
 */
const Foto = () => {
  const [activeFilter, setActiveFilter] = useState("tutti");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filters = [
    { id: "tutti", label: "Tutte le Foto" },
    { id: "missione", label: "Missione" },
    { id: "bambui", label: "Bambuí" },
    { id: "eventi", label: "Eventi" },
    { id: "persone", label: "Persone" },
  ];

  // Funzione per caricare dinamicamente le foto dalla cartella assets/gallery
  // Formato file atteso: category/filename.jpg
  const loadGalleryImages = () => {
    try {
      // @ts-ignore - Vite specific feature
      // Load all images recursively from subdirectories
      const glob = import.meta.glob('@/assets/gallery/*/*.{png,jpg,jpeg,webp}', { eager: true });

      return Object.entries(glob).map(([path, module]: [string, any]) => {
        // path is like "/src/assets/gallery/category/filename.jpg"
        const parts = path.split('/');
        const filename = parts.pop()?.split('.')[0] || ""; // Remove extension
        const folder = parts.pop(); // The folder name (category)

        const category = folder?.toLowerCase() || "varie";
        // Clean up caption: remove hyphens/underscores/extension
        const caption = filename.replace(/[-_]/g, ' ');

        return {
          url: module.default,
          caption: caption.charAt(0).toUpperCase() + caption.slice(1), // Capitalize
          category: category
        };
      });
    } catch (e) {
      console.error("Error loading gallery images:", e);
      return [];
    }
  };

  const [customPhotos, setCustomPhotos] = useState<any[]>([]);

  // Load custom photos from admin panel (Supabase)
  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setCustomPhotos(data);
      }
    };
    fetchPhotos();
  }, []);

  const dynamicPhotos = loadGalleryImages();

  /* 
   * Foto statiche rimosse come richiesto.
   * Le foto vengono caricate solo dalla cartella assets/gallery (dynamicPhotos) 
   * e dal database (customPhotos).
   */

  // Unisci foto dinamiche (file) e custom (admin)
  const photos = [...dynamicPhotos, ...customPhotos];


  const filteredPhotos =
    activeFilter === "tutti" ? photos : photos.filter((photo) => photo.category === activeFilter);
  
  const handlePrev = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredPhotos.length - 1 : prev - 1;
    });
  }, [filteredPhotos.length]);

  const handleNext = useCallback(() => {
    setSelectedPhotoIndex((prev) => {
      if (prev === null) return null;
      return prev === filteredPhotos.length - 1 ? 0 : prev + 1;
    });
  }, [filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, handleNext, handlePrev]);

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

  const selectedPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <div className="min-h-screen">
      <SEO
        title="Galleria Fotografica"
        description="Immagini storiche e recenti che raccontano la missione, gli eventi e la vita della comunità di Bambuí e dell'Associazione."
      />
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary via-primary-light to-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-primary-foreground mb-6 animate-slide-up">Galleria Fotografica</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
              Immagini che raccontano la vita e l'opera di Don Mario Gerlin
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${activeFilter === filter.id
                    ? "gradient-gold shadow-gold scale-105"
                    : "border-2 border-secondary hover:bg-secondary/10"
                    }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="group relative rounded-3xl overflow-hidden shadow-elegant 
                           hover:shadow-xl transition-all duration-500 border-4 border-secondary 
                           hover:scale-105 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-[4/3] bg-card">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-all duration-500 
                              flex items-end justify-center p-6"
                  >
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 text-primary-foreground">
                        <ImageIcon size={24} />
                        <p className="font-semibold text-lg">{photo.caption}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="text-center py-20">
                <ImageIcon size={64} className="mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-xl text-muted-foreground">Nessuna foto trovata in questa categoria</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <Dialog
        open={selectedPhotoIndex !== null}
        onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}
      >
        <DialogContent 
          className="max-w-7xl w-full h-full md:h-auto md:max-h-[95vh] bg-transparent border-none shadow-none p-0 text-white flex items-center justify-center outline-none [&>button]:hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <DialogTitle className="sr-only">{selectedPhoto?.caption}</DialogTitle>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button - custom positioned */}
            <DialogClose className="absolute right-4 top-4 md:-right-12 md:-top-12 z-50 rounded-full bg-black/50 p-2 hover:bg-black/70 transition-colors text-white">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>

            {/* Navigation Buttons (Desktop) */}
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 handlePrev();
               }}
               className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 
                          bg-black/30 hover:bg-black/60 p-3 rounded-full 
                          transition-all duration-300 transform hover:scale-110"
               aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </button>

            <button
               onClick={(e) => {
                 e.stopPropagation();
                 handleNext();
               }}
               className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 
                          bg-black/30 hover:bg-black/60 p-3 rounded-full 
                          transition-all duration-300 transform hover:scale-110"
               aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </button>

            {/* Image Container */}
            <div className="flex flex-col items-center justify-center max-w-full">
              <img
                src={selectedPhoto?.url}
                alt={selectedPhoto?.caption}
                className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl select-none"
              />
              <p className="mt-4 text-xl font-semibold text-center drop-shadow-md px-4">
                {selectedPhoto?.caption}
              </p>
              <p className="text-sm text-white/70 mt-2">
                {selectedPhotoIndex !== null && `${selectedPhotoIndex + 1} / ${filteredPhotos.length}`}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Foto;
