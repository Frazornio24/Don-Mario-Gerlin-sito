import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className = '',
  variant = 'default' 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Per favore inserisci un indirizzo email valido');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - in production, connect to your newsletter service
      // like Mailchimp, ConvertKit, or custom backend
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'website',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Errore durante la sottoscrizione');
      }

      // Success
      setIsSubscribed(true);
      setEmail('');
      
      toast({
        title: "Iscrizione completata!",
        description: "Grazie per esserti iscritto alla nostra newsletter.",
      });

      // Track conversion
      if (typeof window !== 'undefined' && (window as unknown as { gtag: Function }).gtag) {
        (window as unknown as { gtag: Function }).gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': 'homepage_newsletter'
        });
      }

    } catch (err) {
      setError('Si è verificato un errore. Riprova più tardi.');
      toast({
        variant: "destructive",
        title: "Errore di iscrizione",
        description: "Non siamo riusciti a iscriverti alla newsletter. Riprova.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubscribed(false);
    setEmail('');
    setError(null);
  };

  // Different styles based on variant
  const baseClasses = "w-full";
  const variantClasses = {
    default: "p-6 bg-card rounded-xl shadow-lg border border-border",
    compact: "p-4 bg-muted rounded-lg",
    hero: "p-8 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-2xl backdrop-blur-sm border border-secondary/30"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {isSubscribed ? (
        <div className="text-center py-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            Iscrizione completata!
          </h3>
          <p className="text-muted-foreground mb-4">
            Grazie per esserti unito alla nostra community. Riceverai presto le nostre aggiornamenti.
          </p>
          <Button onClick={resetForm} variant="outline">
            Iscrivi un altro indirizzo
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-6 w-6 text-secondary" />
            <h3 className="text-xl font-bold text-foreground">
              {variant === 'hero' ? 'Rimani aggiornato sulla nostra missione' : 'Newsletter'}
            </h3>
          </div>
          
          <p className="text-muted-foreground mb-6">
            {variant === 'hero' 
              ? 'Ricevi aggiornamenti mensili sulle nostre attività in Brasile e su come puoi supportare la nostra causa.'
              : 'Iscriviti per ricevere aggiornamenti sulle nostre iniziative.'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Il tuo indirizzo email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Indirizzo email per la newsletter"
                  disabled={isLoading}
                  className="h-12 text-base"
                />
                {error && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading || !email}
                className="h-12 px-6 font-semibold gradient-gold hover:scale-105 transition-transform"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Iscrizione...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Iscriviti
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Rispettiamo la tua privacy. Puoi annullare l'iscrizione in qualsiasi momento. 
              Leggi la nostra{' '}
              <a href="/privacy" className="text-secondary hover:underline">
                privacy policy
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;