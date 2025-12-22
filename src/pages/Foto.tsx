import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Foto Page
 * Galleria fotografica
 */
const Foto = () => {
  const [activeFilter, setActiveFilter] = useState("tutti");
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string } | null>(
    null
  );

  const filters = [
    { id: "tutti", label: "Tutte le Foto" },
    { id: "missione", label: "Missione" },
    { id: "bambui", label: "Bambuí" },
    { id: "eventi", label: "Eventi" },
    { id: "persone", label: "Persone" },
  ];

  // Funzione per caricare dinamicamente le foto dalla cartella assets/gallery
  // Formato file atteso: categoria-descrizione.jpg (es: missione-viaggio_in_brasile.jpg)
  const loadGalleryImages = () => {
    try {
      // @ts-ignore - Vite specific feature
      const glob = import.meta.glob('@/assets/gallery/*.{png,jpg,jpeg,webp}', { eager: true });

      return Object.entries(glob).map(([path, module]: [string, any]) => {
        // Estrai nome file
        const filename = path.split('/').pop()?.split('.')[0] || "";

        // Estrai categoria e caption dal nome file
        // Es: "missione-viaggio_2023" -> category: "missione", caption: "viaggio 2023"
        const parts = filename.split('-');
        let category = "varie";
        let caption = filename.replace(/_/g, ' ');

        const knownCategories = ["missione", "bambui", "eventi", "persone"];

        if (parts.length > 1 && knownCategories.includes(parts[0].toLowerCase())) {
          category = parts[0].toLowerCase();
          caption = parts.slice(1).join(' ').replace(/_/g, ' ');
        }

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

  // Load custom photos from admin panel (Local Storage)
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

  // Foto statiche di esempio (verranno mostrate se non ci sono foto nella cartella o insieme ad esse)
  const staticPhotos = [
    {
      url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop",
      caption: "Don Mario con la comunità",
      category: "missione",
    },
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      caption: "Scuola a Bambuí",
      category: "bambui",
    },
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=600&fit=crop",
      caption: "Celebrazione commemorativa",
      category: "eventi",
    },
    {
      url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
      caption: "Momento di preghiera",
      category: "missione",
    },
    {
      url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
      caption: "Ospedale",
      category: "bambui",
    },
    {
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
      caption: "Incontro con i fedeli",
      category: "persone",
    },
    {
      url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&h=600&fit=crop",
      caption: "Testimonianze di fede",
      category: "eventi",
    },
    {
      url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop",
      caption: "Comunità unita",
      category: "persone",
    },
    {
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
      caption: "Opera missionaria",
      category: "missione",
    },
  ];

  // Unisci foto dinamiche (file), custom (admin), e statiche
  const photos = [...dynamicPhotos, ...customPhotos, ...staticPhotos];


  const filteredPhotos =
    activeFilter === "tutti" ? photos : photos.filter((photo) => photo.category === activeFilter);

  return (
    <div className="min-h-screen">
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
                  onClick={() => setSelectedPhoto(photo)}
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
        open={!!selectedPhoto}
        onOpenChange={(open) => !open && setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-5xl bg-transparent border-none shadow-none p-0 text-white">
          <DialogTitle className="sr-only">{selectedPhoto?.caption}</DialogTitle>
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={selectedPhoto?.url}
              alt={selectedPhoto?.caption}
              className="max-h-[85vh] w-auto rounded-lg shadow-2xl"
            />
            <p className="mt-4 text-xl font-semibold text-center drop-shadow-md">
              {selectedPhoto?.caption}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Foto;
