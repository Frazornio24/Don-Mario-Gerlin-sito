import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut,
  FileText,
  Image as ImageIcon,
  Calendar,
  Users,
  Plus,
  Trash2,
  Loader2,
  Upload,
  ExternalLink,
  Search,
  FileDown,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("articoli");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Loading States
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCollabs, setLoadingCollabs] = useState(false);

  // Data States
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [onlineArticles, setOnlineArticles] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");

  // Modals Open State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);

  // Form Submit Loading States
  const [submitting, setSubmitting] = useState(false);

  // File Inputs Refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const eventAttachmentInputRef = useRef<HTMLInputElement>(null);
  const collabImageInputRef = useRef<HTMLInputElement>(null);
  const collabPdfInputRef = useRef<HTMLInputElement>(null);

  // --- Fetching Logic ---
  const fetchPdfs = async () => {
    setLoadingPdf(true);
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (data) setPdfs(data);
    setLoadingPdf(false);
  };

  const fetchOnlineArticles = async () => {
    setLoadingOnline(true);
    const { data } = await supabase.from("online_articles").select("*").order("created_at", { ascending: false });
    if (data) setOnlineArticles(data);
    setLoadingOnline(false);
  };

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    const { data } = await supabase.from("photos").select("*").order("created_at", { ascending: false });
    if (data) setPhotos(data);
    setLoadingPhotos(false);
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (data) setEvents(data);
    setLoadingEvents(false);
  };

  const fetchCollaborations = async () => {
    setLoadingCollabs(true);
    const { data } = await supabase.from("collaborations").select("*").order("created_at", { ascending: false });
    if (data) setCollaborations(data);
    setLoadingCollabs(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "Amministratore");
      }
    };
    checkUser();
    fetchPdfs();
    fetchOnlineArticles();
    fetchPhotos();
    fetchEvents();
    fetchCollaborations();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Disconnesso", description: "Sei uscito dall'area riservata." });
    navigate("/admin/login");
  };

  // --- File Upload Helper ---
  const uploadToStorage = async (file: File, prefix: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const fileName = `${prefix}_${Date.now()}_${sanitizedName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName);
    return publicUrl;
  };

  // --- PDF Document Handlers ---
  const handleAddPdf = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const file = pdfInputRef.current?.files?.[0];

    if (!file) {
      toast({ title: "File mancante", description: "Seleziona un documento PDF da caricare.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const url = await uploadToStorage(file, "doc");
      const { error } = await supabase.from("documents").insert([{ title, description, url }]);
      if (error) throw error;

      toast({ title: "Documento aggiunto", description: "Il PDF è stato inserito con successo." });
      setIsPdfModalOpen(false);
      fetchPdfs();
    } catch (err: any) {
      toast({ title: "Errore durante il salvataggio", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePdf = async (id: string, url: string) => {
    if (!window.confirm("Vuoi eliminare questo PDF permanentemente?")) return;
    try {
      const fileName = url.split("/").pop();
      if (fileName && !url.startsWith("/documents/")) {
        await supabase.storage.from("media").remove([fileName]);
      }
      await supabase.from("documents").delete().eq("id", id);
      toast({ title: "Documento eliminato", description: "Il PDF è stato rimosso." });
      fetchPdfs();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  // --- Online Article Handlers ---
  const handleAddOnline = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const source = (form.elements.namedItem("source") as HTMLInputElement).value;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value;
    const tagsString = (form.elements.namedItem("tags") as HTMLInputElement).value;

    const tags = tagsString
      ? tagsString.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from("online_articles")
        .insert([{ title, description, source, date, url, tags }]);
      if (error) throw error;

      toast({ title: "Articolo aggiunto", description: "L'articolo online è stato inserito." });
      setIsOnlineModalOpen(false);
      fetchOnlineArticles();
    } catch (err: any) {
      toast({ title: "Errore durante il salvataggio", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOnline = async (id: string) => {
    if (!window.confirm("Vuoi eliminare questo articolo online?")) return;
    try {
      await supabase.from("online_articles").delete().eq("id", id);
      toast({ title: "Articolo eliminato", description: "L'articolo è stato rimosso." });
      fetchOnlineArticles();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  // --- Photo Handlers ---
  const handleAddPhoto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const caption = (form.elements.namedItem("caption") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const file = photoInputRef.current?.files?.[0];

    if (!file) {
      toast({ title: "Immagine mancante", description: "Seleziona un'immagine da caricare.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const url = await uploadToStorage(file, "photo");
      const { error } = await supabase.from("photos").insert([{ caption, category, url }]);
      if (error) throw error;

      toast({ title: "Foto aggiunta", description: "L'immagine è stata aggiunta alla galleria." });
      setIsPhotoModalOpen(false);
      fetchPhotos();
    } catch (err: any) {
      toast({ title: "Errore durante il salvataggio", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id: string, url: string) => {
    if (!window.confirm("Vuoi eliminare questa foto permanentemente?")) return;
    try {
      const fileName = url.split("/").pop();
      if (fileName && !url.startsWith("/gallery/")) {
        await supabase.storage.from("media").remove([fileName]);
      }
      await supabase.from("photos").delete().eq("id", id);
      toast({ title: "Foto eliminata", description: "L'immagine è stata rimossa." });
      fetchPhotos();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  // --- Event Handlers ---
  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const dateVal = (form.elements.namedItem("date") as HTMLInputElement).value;
    const file = eventAttachmentInputRef.current?.files?.[0];

    try {
      setSubmitting(true);
      let attachment_url = null;
      if (file) {
        attachment_url = await uploadToStorage(file, "event");
      }

      const { error } = await supabase
        .from("events")
        .insert([{ title, description, date: dateVal || null, attachment_url }]);
      if (error) throw error;

      toast({ title: "Evento aggiunto", description: "L'evento è stato registrato." });
      setIsEventModalOpen(false);
      fetchEvents();
    } catch (err: any) {
      toast({ title: "Errore durante il salvataggio", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string, attachment_url: string | null) => {
    if (!window.confirm("Vuoi eliminare questo evento?")) return;
    try {
      if (attachment_url) {
        const fileName = attachment_url.split("/").pop();
        if (fileName) {
          await supabase.storage.from("media").remove([fileName]);
        }
      }
      await supabase.from("events").delete().eq("id", id);
      toast({ title: "Evento eliminato", description: "L'evento è stato rimosso." });
      fetchEvents();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  // --- Collaboration Handlers ---
  const handleAddCollab = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;
    const url = (form.elements.namedItem("url") as HTMLInputElement).value;
    const imageFile = collabImageInputRef.current?.files?.[0];
    const pdfFile = collabPdfInputRef.current?.files?.[0];

    try {
      setSubmitting(true);
      let image_url = null;
      let attachment_url = null;

      if (imageFile) {
        image_url = await uploadToStorage(imageFile, "collab_img");
      }
      if (pdfFile) {
        attachment_url = await uploadToStorage(pdfFile, "collab_doc");
      }

      const { error } = await supabase.from("collaborations").insert([{ 
        title, 
        description, 
        url,
        image_url,
        attachment_url
      }]);
      if (error) throw error;

      toast({ title: "Collaborazione aggiunta", description: "La collaborazione è stata registrata." });
      setIsCollabModalOpen(false);
      fetchCollaborations();
    } catch (err: any) {
      toast({ title: "Errore durante il salvataggio", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCollab = async (id: string, image_url?: string | null, attachment_url?: string | null) => {
    if (!window.confirm("Vuoi eliminare questa collaborazione?")) return;
    try {
      if (image_url) {
        const fileName = image_url.split("/").pop();
        if (fileName && !image_url.startsWith("/gallery/")) {
          await supabase.storage.from("media").remove([fileName]);
        }
      }
      if (attachment_url) {
        const fileName = attachment_url.split("/").pop();
        if (fileName && !attachment_url.startsWith("/documents/")) {
          await supabase.storage.from("media").remove([fileName]);
        }
      }
      await supabase.from("collaborations").delete().eq("id", id);
      toast({ title: "Collaborazione eliminata", description: "La collaborazione è stata rimossa." });
      fetchCollaborations();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Dashboard Profile Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-6 rounded-3xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Pannello Amministratore</h1>
                <p className="text-sm text-muted-foreground">Accesso come: {email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-red-200 hover:bg-red-50 hover:text-red-700 text-red-600 rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" /> Esci
            </Button>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearchQuery(""); }} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-muted p-1.5 rounded-2xl h-auto">
              <TabsTrigger value="articoli" className="rounded-xl py-3 text-sm font-semibold flex items-center gap-2">
                <FileText size={18} /> Articoli
              </TabsTrigger>
              <TabsTrigger value="foto" className="rounded-xl py-3 text-sm font-semibold flex items-center gap-2">
                <ImageIcon size={18} /> Foto
              </TabsTrigger>
              <TabsTrigger value="eventi" className="rounded-xl py-3 text-sm font-semibold flex items-center gap-2">
                <Calendar size={18} /> Eventi
              </TabsTrigger>
              <TabsTrigger value="collaborazioni" className="rounded-xl py-3 text-sm font-semibold flex items-center gap-2">
                <Users size={18} /> Collaborazioni
              </TabsTrigger>
            </TabsList>

            {/* TAB: ARTICOLI */}
            <TabsContent value="articoli" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* PDF documents manager */}
                <Card className="border border-border/80 rounded-3xl shadow-sm">
                  <CardHeader className="flex flex-row justify-between items-center pb-4">
                    <div>
                      <CardTitle className="text-xl font-bold">Documenti PDF</CardTitle>
                      <CardDescription>Carica file PDF d'archivio (rassegna stampa, letture)</CardDescription>
                    </div>
                    <Button onClick={() => setIsPdfModalOpen(true)} className="gradient-primary text-white rounded-xl h-10 px-4">
                      <Plus size={18} className="mr-1" /> Aggiungi
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingPdf ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-secondary" /></div>
                    ) : pdfs.length === 0 ? (
                      <p className="text-center py-10 text-muted-foreground text-sm">Nessun documento PDF registrato.</p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {pdfs.map((pdf) => (
                          <div key={pdf.id} className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl border border-border/60">
                            <div className="min-w-0 pr-4">
                              <p className="font-semibold text-sm truncate">{pdf.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{pdf.description}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Button asChild size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/10">
                                <a href={pdf.url} target="_blank" rel="noreferrer" title="Visualizza"><FileDown size={18} /></a>
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeletePdf(pdf.id, pdf.url)} className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50">
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Online articles links manager */}
                <Card className="border border-border/80 rounded-3xl shadow-sm">
                  <CardHeader className="flex flex-row justify-between items-center pb-4">
                    <div>
                      <CardTitle className="text-xl font-bold">Articoli Online</CardTitle>
                      <CardDescription>Inserisci link ad articoli recenti sui media locali</CardDescription>
                    </div>
                    <Button onClick={() => setIsOnlineModalOpen(true)} className="gradient-gold text-secondary-foreground rounded-xl h-10 px-4">
                      <Plus size={18} className="mr-1" /> Aggiungi
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loadingOnline ? (
                      <div className="flex justify-center py-10"><Loader2 className="animate-spin text-secondary" /></div>
                    ) : onlineArticles.length === 0 ? (
                      <p className="text-center py-10 text-muted-foreground text-sm">Nessun articolo online registrato.</p>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {onlineArticles.map((art) => (
                          <div key={art.id} className="flex justify-between items-center p-4 bg-muted/40 rounded-2xl border border-border/60">
                            <div className="min-w-0 pr-4">
                              <p className="font-semibold text-sm truncate">{art.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{art.source} - {art.date}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Button asChild size="icon" variant="ghost" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/10">
                                <a href={art.url} target="_blank" rel="noreferrer" title="Apri Link"><ExternalLink size={18} /></a>
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteOnline(art.id)} className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50">
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TAB: FOTO */}
            <TabsContent value="foto" className="space-y-6">
              <Card className="border border-border/80 rounded-3xl shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center pb-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">Galleria Fotografica</CardTitle>
                    <CardDescription>Aggiungi e rimuovi le foto visibili nella pagina galleria del sito</CardDescription>
                  </div>
                  <Button onClick={() => setIsPhotoModalOpen(true)} className="gradient-primary text-white rounded-xl h-11 px-6">
                    <Plus size={18} className="mr-1.5" /> Aggiungi Nuova Foto
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingPhotos ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary h-8 w-8" /></div>
                  ) : photos.length === 0 ? (
                    <p className="text-center py-20 text-muted-foreground">Nessuna foto presente nella galleria.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {photos.map((ph) => (
                        <div key={ph.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-border shadow-sm bg-muted flex flex-col justify-between">
                          <img src={ph.url} alt={ph.caption} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-primary-foreground px-2 py-0.5 rounded-full w-max">
                              {ph.category}
                            </span>
                            <div className="space-y-2">
                              <p className="text-xs font-medium line-clamp-2">{ph.caption}</p>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePhoto(ph.id, ph.url)}
                                className="w-full h-8 rounded-lg flex items-center justify-center gap-1 text-[11px]"
                              >
                                <Trash2 size={12} /> Elimina
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: EVENTI */}
            <TabsContent value="eventi" className="space-y-6">
              <Card className="border border-border/80 rounded-3xl shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center pb-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">Eventi ed Iniziative</CardTitle>
                    <CardDescription>Gestisci gli eventi futuri o passati, con possibilità di allegare volantini PDF</CardDescription>
                  </div>
                  <Button onClick={() => setIsEventModalOpen(true)} className="gradient-gold text-secondary-foreground rounded-xl h-11 px-6 font-semibold">
                    <Plus size={18} className="mr-1.5" /> Aggiungi Nuovo Evento
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingEvents ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary h-8 w-8" /></div>
                  ) : events.length === 0 ? (
                    <p className="text-center py-20 text-muted-foreground">Nessun evento registrato.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map((ev) => (
                        <Card key={ev.id} className="border border-border bg-muted/30 hover:border-secondary/30 transition-all rounded-2xl flex flex-col justify-between p-5 space-y-4">
                          <div className="space-y-2">
                            <h3 className="font-bold text-lg text-primary">{ev.title}</h3>
                            {ev.date && (
                              <p className="text-xs text-secondary font-bold">
                                Data: {new Date(ev.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground line-clamp-3">{ev.description}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-border">
                            {ev.attachment_url ? (
                              <a
                                href={ev.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                              >
                                <FileDown size={14} /> Allegato PDF
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground/60 italic">Senza allegato</span>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(ev.id, ev.attachment_url)} className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50">
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: COLLABORAZIONI */}
            <TabsContent value="collaborazioni" className="space-y-6">
              <Card className="border border-border/80 rounded-3xl shadow-sm">
                <CardHeader className="flex flex-row justify-between items-center pb-4">
                  <div>
                    <CardTitle className="text-2xl font-bold">Pagine Amiche e Collaborazioni</CardTitle>
                    <CardDescription>Gestisci i collegamenti alle pagine Facebook delle realtà in Brasile ed Italia</CardDescription>
                  </div>
                  <Button onClick={() => setIsCollabModalOpen(true)} className="gradient-primary text-white rounded-xl h-11 px-6">
                    <Plus size={18} className="mr-1.5" /> Aggiungi Collaborazione
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingCollabs ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary h-8 w-8" /></div>
                  ) : collaborations.length === 0 ? (
                    <p className="text-center py-20 text-muted-foreground">Nessuna collaborazione registrata.</p>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {collaborations.map((col) => (
                        <Card key={col.id} className="border border-border bg-muted/30 hover:border-secondary/30 transition-all rounded-2xl flex flex-col justify-between p-5 space-y-4">
                          <div className="space-y-4">
                            {col.image_url && (
                              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border bg-muted">
                                <img src={col.image_url} alt={col.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="space-y-2">
                              <h3 className="font-bold text-lg text-primary">{col.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">{col.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 pt-3 border-t border-border">
                            {col.attachment_url && (
                              <a
                                href={col.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1.5"
                              >
                                <FileText size={14} /> Allegato PDF
                              </a>
                            )}
                            <div className="flex justify-between items-center w-full">
                              <a
                                href={col.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                              >
                                Visita link <ExternalLink size={14} />
                              </a>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteCollab(col.id, col.image_url, col.attachment_url)} className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50">
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* Modal Add PDF */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none">
          <form onSubmit={handleAddPdf} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Carica Documento PDF</DialogTitle>
              <DialogDescription>Aggiungi un nuovo PDF all'archivio documentale degli articoli.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Titolo</label>
                <Input name="title" required placeholder="Esempio: Premio Toniolo - Il Gazzettino" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrizione</label>
                <Textarea name="description" required placeholder="Inserisci una breve didascalia dell'articolo..." className="rounded-xl mt-1" rows={3} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">File PDF</label>
                <div className="mt-1 flex items-center gap-3">
                  <Input
                    type="file"
                    ref={pdfInputRef}
                    accept="application/pdf"
                    required
                    className="rounded-xl h-11 flex-1 file:bg-secondary/15 file:text-secondary file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPdfModalOpen(false)} className="rounded-xl h-11">Annulla</Button>
              <Button type="submit" disabled={submitting} className="gradient-primary text-white rounded-xl h-11 px-6">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Carica ed Inserisci"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Add Online Article */}
      <Dialog open={isOnlineModalOpen} onOpenChange={setIsOnlineModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none">
          <form onSubmit={handleAddOnline} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Aggiungi Articolo Online</DialogTitle>
              <DialogDescription>Aggiungi un collegamento web ad un articolo di giornale online.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Titolo</label>
                <Input name="title" required placeholder="Esempio: 30° Anniversario della Morte" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrizione / Sottotitolo</label>
                <Textarea name="description" required placeholder="Inserisci un breve estratto o citazione..." className="rounded-xl mt-1" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Fonte</label>
                  <Input name="source" required placeholder="Esempio: QdP News" className="rounded-xl mt-1 h-11" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase">Data</label>
                  <Input name="date" required placeholder="Esempio: 27 Febbraio 2023" className="rounded-xl mt-1 h-11" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">URL Articolo</label>
                <Input name="url" type="url" required placeholder="https://www.esempio.com/articolo" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Tags (separati da virgola)</label>
                <Input name="tags" placeholder="Esempio: Commemorazione, Trentennale" className="rounded-xl mt-1 h-11" />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOnlineModalOpen(false)} className="rounded-xl h-11">Annulla</Button>
              <Button type="submit" disabled={submitting} className="gradient-gold text-secondary-foreground rounded-xl h-11 px-6 font-semibold">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Aggiungi Articolo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Add Photo */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none">
          <form onSubmit={handleAddPhoto} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Carica Foto in Galleria</DialogTitle>
              <DialogDescription>Seleziona un'immagine da inserire nella galleria fotografica pubblica.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Didascalia / Titolo</label>
                <Input name="caption" required placeholder="Descrivi il soggetto della foto..." className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Categoria</label>
                <select name="category" required className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-1 focus:ring-2 focus:ring-secondary outline-none">
                  <option value="missione">Missione</option>
                  <option value="bambui">Bambuí</option>
                  <option value="eventi">Eventi</option>
                  <option value="persone">Persone</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">File Immagine</label>
                <Input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  required
                  className="rounded-xl h-11 mt-1 file:bg-secondary/15 file:text-secondary file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPhotoModalOpen(false)} className="rounded-xl h-11">Annulla</Button>
              <Button type="submit" disabled={submitting} className="gradient-primary text-white rounded-xl h-11 px-6">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Carica Foto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Add Event */}
      <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none">
          <form onSubmit={handleAddEvent} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Evento</DialogTitle>
              <DialogDescription>Aggiungi un'iniziativa o evento in programma, con eventuale allegato PDF.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Titolo Evento</label>
                <Input name="title" required placeholder="Esempio: Assemblea Annuale Associazione" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrizione</label>
                <Textarea name="description" required placeholder="Fornisci dettagli sull'evento, orario e luogo..." className="rounded-xl mt-1" rows={3} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Data dell'Evento (opzionale)</label>
                <Input name="date" type="datetime-local" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Allegato PDF / Volantino (opzionale)</label>
                <Input
                  type="file"
                  ref={eventAttachmentInputRef}
                  accept="application/pdf,image/*"
                  className="rounded-xl h-11 mt-1 file:bg-secondary/15 file:text-secondary file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEventModalOpen(false)} className="rounded-xl h-11">Annulla</Button>
              <Button type="submit" disabled={submitting} className="gradient-gold text-secondary-foreground rounded-xl h-11 px-6 font-semibold">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Registra Evento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Add Collaboration */}
      <Dialog open={isCollabModalOpen} onOpenChange={setIsCollabModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border-none">
          <form onSubmit={handleAddCollab} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Aggiungi Collaborazione</DialogTitle>
              <DialogDescription>Aggiungi un link ad una realtà partner o pagina social collegata in Brasile/Italia.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Nome della Realtà / Titolo</label>
                <Input name="title" required placeholder="Esempio: Ospedale Don Mario Gerlin" className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Descrizione</label>
                <Textarea name="description" required placeholder="Spiega brevemente la collaborazione..." className="rounded-xl mt-1" rows={3} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Link Esterno (Facebook, Sito Web...)</label>
                <Input name="url" type="url" required placeholder="https://www.facebook.com/..." className="rounded-xl mt-1 h-11" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Immagine di Copertina (opzionale)</label>
                <Input
                  type="file"
                  ref={collabImageInputRef}
                  accept="image/*"
                  className="rounded-xl h-11 mt-1 file:bg-secondary/15 file:text-secondary file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Allegato PDF (opzionale)</label>
                <Input
                  type="file"
                  ref={collabPdfInputRef}
                  accept="application/pdf"
                  className="rounded-xl h-11 mt-1 file:bg-secondary/15 file:text-secondary file:border-none file:px-3 file:py-1 file:rounded-lg file:cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCollabModalOpen(false)} className="rounded-xl h-11">Annulla</Button>
              <Button type="submit" disabled={submitting} className="gradient-primary text-white rounded-xl h-11 px-6">
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Aggiungi Collaborazione"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}

export default Dashboard;
