import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Inserisci sia l'email che la password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Accesso effettuato!",
        description: "Benvenuto nel pannello di controllo.",
      });
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Errore di accesso",
        description: error.message || "Credenziali non valide",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 pt-28">
        <div className="w-full max-w-md space-y-8 animate-scale-in">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-gold mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-primary font-serif">Area Riservata</h2>
            <p className="mt-2 text-muted-foreground">
              Accedi per gestire i contenuti del sito dell'associazione
            </p>
          </div>

          <Card className="border border-border/80 shadow-elegant rounded-3xl overflow-hidden bg-card">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">Accedi come Admin</CardTitle>
              <CardDescription>
                Inserisci le tue credenziali di amministratore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-lg rounded-xl border-2 focus-visible:ring-secondary focus-visible:border-secondary"
                    placeholder="admin@amicidongerlin.it"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-lg rounded-xl border-2 focus-visible:ring-secondary focus-visible:border-secondary"
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 gradient-gold text-lg font-semibold rounded-xl hover:shadow-gold hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifica in corso...
                    </>
                  ) : (
                    <>
                      Accedi
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;
