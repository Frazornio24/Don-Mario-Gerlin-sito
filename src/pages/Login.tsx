import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            navigate("/admin");
        } catch (error: any) {
            setError(error.message || "Credenziali non valide");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4 pt-20">
                <div className="w-full max-w-md space-y-8 animate-scale-in">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-gold mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground">Area Riservata</h2>
                        <p className="mt-2 text-muted-foreground">
                            Accedi per gestire i contenuti del sito
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 bg-card p-8 rounded-3xl shadow-elegant border border-border">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                Email Amministratore
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                className="h-12 text-lg rounded-xl border-2 focus:border-secondary mb-4"
                                placeholder="admin@example.com"
                            />
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                Password Amministratore
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                className={`h-12 text-lg rounded-xl border-2 ${error ? "border-red-500" : "focus:border-secondary"}`}
                                placeholder="Inserisci la password"
                            />
                            {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 gradient-gold text-lg font-semibold rounded-xl hover:shadow-gold hover:scale-[1.02] transition-all duration-300"
                        >
                            Accedi
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Login;
