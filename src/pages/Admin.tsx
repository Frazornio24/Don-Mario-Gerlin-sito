import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Image as ImageIcon, FileText, LogOut, Save, Eye, Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

// Definisco le interfacce per i dati
interface CustomPhoto {
    id: string;
    url: string;
    caption: string;
    category: string;
}

interface CustomDocument {
    id: string;
    title: string;
    description: string;
    url: string; // Base64 o link esterno
}

const Admin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // State per Foto
    const [photos, setPhotos] = useState<CustomPhoto[]>([]);
    const [newPhoto, setNewPhoto] = useState({ url: "", caption: "", category: "missione" });
    const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [showPhotoPreview, setShowPhotoPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);


    // State per Documenti
    const [documents, setDocuments] = useState<CustomDocument[]>([]);
    const [newDoc, setNewDoc] = useState({ title: "", description: "", url: "" });
    const [selectedDocFile, setSelectedDocFile] = useState<File | null>(null);
    const [editingDocId, setEditingDocId] = useState<string | null>(null);
    const [showDocPreview, setShowDocPreview] = useState(false);

    useEffect(() => {
        // Check Auth
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate("/login");
            }
        };
        checkAuth();

        // Load Data
        const fetchData = async () => {
            const { data: photosData, error: photosError } = await supabase
                .from('photos')
                .select('*')
                .order('created_at', { ascending: false });

            if (photosData) setPhotos(photosData);
            if (photosError) console.error("Error fetching photos:", photosError);

            const { data: docsData, error: docsError } = await supabase
                .from('documents')
                .select('*')
                .order('created_at', { ascending: false });

            if (docsData) setDocuments(docsData);
            if (docsError) console.error("Error fetching documents:", docsError);
        };
        fetchData();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        sessionStorage.removeItem("isAdmin");
        navigate("/login");
    };

    // --- Gestione Foto ---
    const openPhotoPreview = () => {
        if (!newPhoto.caption) {
            toast({ title: "Errore", description: "Inserisci almeno una didascalia", variant: "destructive" });
            return;
        }
        if (!newPhoto.url && !selectedPhotoFile) {
             toast({ title: "Errore", description: "Seleziona una foto o inserisci un URL", variant: "destructive" });
             return;
        }
        setShowPhotoPreview(true);
    };

    const handleSavePhoto = async () => {
        setIsUploading(true);
        let finalUrl = newPhoto.url;

        // Upload new file only if selected
        if (selectedPhotoFile) {
            const fileExt = selectedPhotoFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('gallery')
                .upload(fileName, selectedPhotoFile);

            if (uploadError) {
                toast({ title: "Errore Upload", description: uploadError.message, variant: "destructive" });
                setIsUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('gallery')
                .getPublicUrl(fileName);
            
            finalUrl = publicUrl;
        }

        if (!finalUrl || !newPhoto.caption) {
            toast({ title: "Errore", description: "Dati mancanti", variant: "destructive" });
            setIsUploading(false);
            return;
        }

        if (editingPhotoId) {
            // UPDATE
            const { error } = await supabase
                .from('photos')
                .update({
                    url: finalUrl,
                    caption: newPhoto.caption,
                    category: newPhoto.category
                })
                .eq('id', editingPhotoId);

            if (error) {
                toast({ title: "Errore Aggiornamento", description: error.message, variant: "destructive" });
            } else {
                setPhotos(photos.map(p => p.id === editingPhotoId ? { ...p, url: finalUrl, caption: newPhoto.caption, category: newPhoto.category } : p));
                toast({ title: "Foto Aggiornata", description: "Modifiche salvate con successo." });
                resetPhotoForm();
            }
        } else {
            // INSERT
            const { data, error } = await supabase
                .from('photos')
                .insert([{
                    url: finalUrl,
                    caption: newPhoto.caption,
                    category: newPhoto.category
                }])
                .select();

            if (error) {
                toast({ title: "Errore Salvataggio", description: error.message, variant: "destructive" });
            } else if (data) {
                setPhotos([data[0], ...photos]);
                toast({ title: "Foto Aggiunta", description: "La foto è ora visibile nella galleria." });
                resetPhotoForm();
            }
        }
        setIsUploading(false);
    };

    const resetPhotoForm = () => {
        setNewPhoto({ url: "", caption: "", category: "missione" });
        setSelectedPhotoFile(null);
        setEditingPhotoId(null);
        setShowPhotoPreview(false);
    };

    const startEditingPhoto = (photo: CustomPhoto) => {
        setNewPhoto({ url: photo.url, caption: photo.caption, category: photo.category });
        setSelectedPhotoFile(null);
        setEditingPhotoId(photo.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeletePhoto = async (id: string, url: string) => {
        if (confirm("Sei sicuro di voler eliminare questa foto?")) {
            const { error } = await supabase
                .from('photos')
                .delete()
                .eq('id', id);

            if (error) {
                toast({ title: "Errore", description: "Impossibile eliminare: " + error.message, variant: "destructive" });
            } else {
                setPhotos(photos.filter(p => p.id !== id));
                if (url.includes('/storage/v1/object/public/gallery/')) {
                    const fileName = url.split('/').pop();
                    if (fileName) {
                        await supabase.storage.from('gallery').remove([fileName]);
                    }
                }
                if (editingPhotoId === id) resetPhotoForm();
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'doc') => {
        const file = e.target.files?.[0];
        if (file) {
            if (type === 'photo') {
                setSelectedPhotoFile(file);
                // Create object URL for preview
                setNewPhoto({ ...newPhoto, url: URL.createObjectURL(file) });
            } else {
                setSelectedDocFile(file);
                setNewDoc({ ...newDoc, url: URL.createObjectURL(file) });
            }
        }
    };

    // --- Gestione Documenti ---
    const openDocPreview = () => {
         if (!newDoc.title || !newDoc.description) {
            toast({ title: "Errore", description: "Compila titolo e descrizione", variant: "destructive" });
            return;
        }
        if (!newDoc.url && !selectedDocFile) {
             toast({ title: "Errore", description: "Seleziona un documento o inserisci un URL", variant: "destructive" });
             return;
        }
        setShowDocPreview(true);
    };

    const handleSaveDoc = async () => {
        setIsUploading(true);
        let finalUrl = newDoc.url;

        if (selectedDocFile) {
            const fileExt = selectedDocFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, selectedDocFile);

            if (uploadError) {
                toast({ title: "Errore Upload", description: uploadError.message, variant: "destructive" });
                setIsUploading(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName);
            
            finalUrl = publicUrl;
        }

        if (!finalUrl || !newDoc.title || !newDoc.description) {
             toast({ title: "Errore", description: "Compila tutti i campi", variant: "destructive" });
             setIsUploading(false);
             return;
        }

        if (editingDocId) {
            // UPDATE
            const { error } = await supabase
                .from('documents')
                .update({
                    title: newDoc.title,
                    description: newDoc.description,
                    url: finalUrl
                })
                .eq('id', editingDocId);

            if (error) {
                toast({ title: "Errore Aggiornamento", description: error.message, variant: "destructive" });
            } else {
                setDocuments(documents.map(d => d.id === editingDocId ? { ...d, title: newDoc.title, description: newDoc.description, url: finalUrl } : d));
                toast({ title: "Documento Aggiornato", description: "Modifiche salvate." });
                resetDocForm();
            }
        } else {
            // INSERT
            const { data, error } = await supabase
                .from('documents')
                .insert([{
                    title: newDoc.title,
                    description: newDoc.description,
                    url: finalUrl
                }])
                .select();

            if (error) {
                toast({ title: "Errore Salvataggio", description: "Errore salvataggio: " + error.message, variant: "destructive" });
            } else if (data) {
                setDocuments([data[0], ...documents]);
                toast({ title: "Documento Aggiunto", description: "Visibile nella pagina Articoli." });
                resetDocForm();
            }
        }
        setIsUploading(false);
    };

    const resetDocForm = () => {
        setNewDoc({ title: "", description: "", url: "" });
        setSelectedDocFile(null);
        setEditingDocId(null);
        setShowDocPreview(false);
    };

    const startEditingDoc = (doc: CustomDocument) => {
        setNewDoc({ title: doc.title, description: doc.description, url: doc.url });
        setSelectedDocFile(null);
        setEditingDocId(doc.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteDoc = async (id: string, url: string) => {
        if (confirm("Sei sicuro di voler eliminare questo documento??")) {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (error) {
                toast({ title: "Errore", description: "Impossibile eliminare: " + error.message, variant: "destructive" });
            } else {
                setDocuments(documents.filter(d => d.id !== id));
                if (url.includes('/storage/v1/object/public/documents/')) {
                    const fileName = url.split('/').pop();
                    if (fileName) {
                        await supabase.storage.from('documents').remove([fileName]);
                    }
                }
                if (editingDocId === id) resetDocForm();
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-24 pb-12 px-4 container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-primary">Pannello Amministratore</h1>
                    <Button variant="outline" onClick={handleLogout} className="border-red-200 hover:bg-red-50 text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /> Esci
                    </Button>
                </div>

                    <Tabs defaultValue="foto" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                        <TabsTrigger value="foto" className="text-lg">Gestione Foto</TabsTrigger>
                        <TabsTrigger value="articoli" className="text-lg">Gestione Articoli</TabsTrigger>
                    </TabsList>

                    {/* TAB FOTO */}
                    <TabsContent value="foto" className="space-y-6">
                        <Card className={editingPhotoId ? "border-2 border-primary shadow-lg" : ""}>
                            <CardHeader>
                                <CardTitle>{editingPhotoId ? "Modifica Foto" : "Aggiungi Nuova Foto"}</CardTitle>
                                <CardDescription>
                                    {editingPhotoId ? "Modifica i dettagli o sostituisci l'immagine." : "Carica una nuova foto per la galleria."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Didascalia</Label>
                                        <Input
                                            placeholder="Es: Don Mario a Bambui"
                                            value={newPhoto.caption}
                                            onChange={e => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Categoria</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newPhoto.category}
                                            onChange={e => setNewPhoto({ ...newPhoto, category: e.target.value })}
                                        >
                                            <option value="missione">Missione</option>
                                            <option value="bambui">Bambuí</option>
                                            <option value="eventi">Eventi</option>
                                            <option value="persone">Persone</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Immagine {editingPhotoId && "(Lascia vuoto per mantenere l'attuale)"}</Label>
                                    <div className="flex gap-4">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'photo')}
                                        />
                                        <div className="text-sm text-muted-foreground self-center">O Incolla URL:</div>
                                        <Input
                                            placeholder="https://..."
                                            value={newPhoto.url}
                                            onChange={e => setNewPhoto({ ...newPhoto, url: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={openPhotoPreview} className="flex-1 gradient-gold" disabled={isUploading}>
                                        {isUploading ? "Elaborazione..." : (editingPhotoId ? <><Save className="mr-2 h-4 w-4" /> Salva Modifiche</> : <><Eye className="mr-2 h-4 w-4" /> Anteprima Foto</>)}
                                    </Button>
                                    {editingPhotoId && (
                                        <Button variant="outline" onClick={resetPhotoForm} disabled={isUploading}>
                                            Annulla
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map(photo => (
                                <div key={photo.id} className={`relative group rounded-xl overflow-hidden border bg-card ${editingPhotoId === photo.id ? "ring-2 ring-primary" : ""}`}>
                                    <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover" />
                                    <div className="p-3">
                                        <p className="font-semibold truncate">{photo.caption}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{photo.category}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 bg-white/90 hover:bg-white text-primary shadow-sm"
                                            onClick={() => startEditingPhoto(photo)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 shadow-sm"
                                            onClick={() => handleDeletePhoto(photo.id, photo.url)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB ARTICOLI */}
                    <TabsContent value="articoli" className="space-y-6">
                        <Card className={editingDocId ? "border-2 border-primary shadow-lg" : ""}>
                            <CardHeader>
                                <CardTitle>{editingDocId ? "Modifica Documento" : "Aggiungi Documento"}</CardTitle>
                                <CardDescription>
                                    {editingDocId ? "Modifica i dettagli o sostituisci il file." : "Aggiungi un nuovo articolo o documento PDF."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titolo</Label>
                                        <Input
                                            placeholder="Es: Articolo Gazzettino"
                                            value={newDoc.title}
                                            onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descrizione</Label>
                                        <Input
                                            placeholder="Breve descrizione..."
                                            value={newDoc.description}
                                            onChange={e => setNewDoc({ ...newDoc, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>File (PDF o Immagine) {editingDocId && "(Lascia vuoto per mantenere l'attuale)"}</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => handleFileChange(e, 'doc')}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={openDocPreview} className="flex-1 gradient-gold" disabled={isUploading}>
                                        {isUploading ? "Elaborazione..." : (editingDocId ? <><Save className="mr-2 h-4 w-4" /> Salva Modifiche</> : <><Eye className="mr-2 h-4 w-4" /> Anteprima Documento</>)}
                                    </Button>
                                     {editingDocId && (
                                        <Button variant="outline" onClick={resetDocForm} disabled={isUploading}>
                                            Annulla
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {documents.map(doc => (
                                <div key={doc.id} className={`flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all ${editingDocId === doc.id ? "border-primary bg-primary/5" : ""}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{doc.title}</h4>
                                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => startEditingDoc(doc)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteDoc(doc.id, doc.url)}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Dialog Preview Foto */}
            <Dialog open={showPhotoPreview} onOpenChange={setShowPhotoPreview}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Anteprima Foto</DialogTitle>
                        <DialogDescription>
                            Ecco come apparirà la foto nella galleria. Conferma per salvare o modifica per tornare al form.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4">
                        {/* Preview stile Foto.tsx */}
                        <div className="group relative rounded-3xl overflow-hidden shadow-elegant 
                                     border-4 border-secondary mx-auto max-w-md">
                            <div className="aspect-[4/3] bg-card">
                                {newPhoto.url && (
                                    <img
                                        src={newPhoto.url}
                                        alt={newPhoto.caption}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent 
                                          flex items-end justify-center p-6">
                                <div className="flex items-center gap-3 text-primary-foreground">
                                    <ImageIcon size={24} />
                                    <p className="font-semibold text-lg">{newPhoto.caption}</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-3 capitalize">
                            Categoria: {newPhoto.category}
                        </p>
                    </div>

                    <DialogFooter className="mt-6 gap-2">
                        <Button variant="outline" onClick={() => setShowPhotoPreview(false)}>
                            <X className="mr-2 h-4 w-4" /> Modifica
                        </Button>
                        <Button onClick={handleSavePhoto} className="gradient-gold" disabled={isUploading}>
                            {isUploading ? "Salvataggio..." : <><Check className="mr-2 h-4 w-4" /> {editingPhotoId ? "Salva Modifiche" : "Conferma e Salva"}</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Preview Documento */}
            <Dialog open={showDocPreview} onOpenChange={setShowDocPreview}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Anteprima Documento</DialogTitle>
                        <DialogDescription>
                            Ecco come apparirà il documento nella pagina Articoli. Conferma per salvare o modifica per tornare al form.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4">
                        {/* Preview stile Stampa.tsx */}
                        <div className="p-8 rounded-3xl bg-card border-2 border-border mx-auto max-w-md">
                            <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center 
                                          mb-6 shadow-gold">
                                <FileText className="text-primary-foreground" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-3">{newDoc.title}</h3>
                            <p className="text-muted-foreground mb-4">{newDoc.description}</p>
                            <p className="text-sm text-muted-foreground/70 mb-6">Documento Caricato</p>
                            <Button
                                variant="outline"
                                className="w-full border-2 border-secondary"
                                disabled
                            >
                                Scarica (Preview)
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 gap-2">
                        <Button variant="outline" onClick={() => setShowDocPreview(false)}>
                            <X className="mr-2 h-4 w-4" /> Modifica
                        </Button>
                        <Button onClick={handleSaveDoc} className="gradient-gold" disabled={isUploading}>
                            {isUploading ? "Salvataggio..." : <><Check className="mr-2 h-4 w-4" /> {editingDocId ? "Salva Modifiche" : "Conferma e Salva"}</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;
