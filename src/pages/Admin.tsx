import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Image as ImageIcon, FileText, LogOut, Save, Eye, Check, X } from "lucide-react";
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
    const [showPhotoPreview, setShowPhotoPreview] = useState(false);

    // State per Documenti
    const [documents, setDocuments] = useState<CustomDocument[]>([]);
    const [newDoc, setNewDoc] = useState({ title: "", description: "", url: "" });
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
        if (!newPhoto.url || !newPhoto.caption) {
            toast({ title: "Errore", description: "Compila tutti i campi prima di visualizzare l'anteprima", variant: "destructive" });
            return;
        }
        setShowPhotoPreview(true);
    };

    const handleAddPhoto = async () => {
        if (!newPhoto.url || !newPhoto.caption) {
            toast({ title: "Errore", description: "Compila tutti i campi", variant: "destructive" });
            return;
        }

        const { data, error } = await supabase
            .from('photos')
            .insert([{
                url: newPhoto.url,
                caption: newPhoto.caption,
                category: newPhoto.category
            }])
            .select();

        if (error) {
            toast({ title: "Errore", description: "Errore durante il salvataggio: " + error.message, variant: "destructive" });
            return;
        }

        if (data) {
            setPhotos([data[0], ...photos]);
            setNewPhoto({ url: "", caption: "", category: "missione" });
            setShowPhotoPreview(false);
            toast({ title: "Foto Aggiunta", description: "La foto è ora visibile nella galleria." });
        }
    };

    const handleDeletePhoto = async (id: string) => {
        const { error } = await supabase
            .from('photos')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Errore", description: "Impossibile eliminare: " + error.message, variant: "destructive" });
        } else {
            setPhotos(photos.filter(p => p.id !== id));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'doc') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === 'photo') {
                    setNewPhoto({ ...newPhoto, url: reader.result as string });
                } else {
                    setNewDoc({ ...newDoc, url: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Gestione Documenti ---
    const openDocPreview = () => {
        if (!newDoc.title || !newDoc.description || !newDoc.url) {
            toast({ title: "Errore", description: "Compila tutti i campi prima di visualizzare l'anteprima", variant: "destructive" });
            return;
        }
        setShowDocPreview(true);
    };

    const handleAddDoc = async () => {
        if (!newDoc.title || !newDoc.description || !newDoc.url) {
            toast({ title: "Errore", description: "Compila tutti i campi", variant: "destructive" });
            return;
        }

        const { data, error } = await supabase
            .from('documents')
            .insert([{
                title: newDoc.title,
                description: newDoc.description,
                url: newDoc.url
            }])
            .select();

        if (error) {
            toast({ title: "Errore", description: "Errore salvataggio documento: " + error.message, variant: "destructive" });
            return;
        }

        if (data) {
            setDocuments([data[0], ...documents]);
            setNewDoc({ title: "", description: "", url: "" });
            setShowDocPreview(false);
            toast({ title: "Documento Aggiunto", description: "Il documento è ora visibile nella pagina stampa." });
        }
    };

    const handleDeleteDoc = async (id: string) => {
        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) {
            toast({ title: "Errore", description: "Impossibile eliminare: " + error.message, variant: "destructive" });
        } else {
            setDocuments(documents.filter(d => d.id !== id));
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
                        <TabsTrigger value="stampa" className="text-lg">Gestione Stampa</TabsTrigger>
                    </TabsList>

                    {/* TAB FOTO */}
                    <TabsContent value="foto" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aggiungi Nuova Foto</CardTitle>
                                <CardDescription>Carica una nuova foto per la galleria.</CardDescription>
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
                                    <Label>Immagine</Label>
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
                                <Button onClick={openPhotoPreview} className="w-full gradient-gold">
                                    <Eye className="mr-2 h-4 w-4" /> Anteprima Foto
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {photos.map(photo => (
                                <div key={photo.id} className="relative group rounded-xl overflow-hidden border bg-card">
                                    <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover" />
                                    <div className="p-3">
                                        <p className="font-semibold truncate">{photo.caption}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{photo.category}</p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleDeletePhoto(photo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB STAMPA */}
                    <TabsContent value="stampa" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Aggiungi Documento</CardTitle>
                                <CardDescription>Aggiungi un nuovo articolo o documento PDF.</CardDescription>
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
                                    <Label>File (PDF o Immagine) o Link</Label>
                                    <Input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => handleFileChange(e, 'doc')}
                                    />
                                </div>
                                <Button onClick={openDocPreview} className="w-full gradient-gold">
                                    <Eye className="mr-2 h-4 w-4" /> Anteprima Documento
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{doc.title}</h4>
                                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDeleteDoc(doc.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
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
                        <Button onClick={handleAddPhoto} className="gradient-gold">
                            <Check className="mr-2 h-4 w-4" /> Conferma e Salva
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
                            Ecco come apparirà il documento nella pagina Stampa. Conferma per salvare o modifica per tornare al form.
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
                        <Button onClick={handleAddDoc} className="gradient-gold">
                            <Check className="mr-2 h-4 w-4" /> Conferma e Salva
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;
