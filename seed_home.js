import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

const puckData = {
  content: [
    {
      type: "HeroBlock",
      props: {
        title: "L'eredità di Don Mario Gerlin",
        subtitle: "Un impegno che continua attraverso le generazioni",
        backgroundUrl: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
        ctaText: "Scopri la Storia",
        ctaLink: "/don-mario",
        id: "hero-1"
      }
    },
    {
      type: "TextBlock",
      props: {
        title: "La Nostra Missione",
        content: "Continua l'opera di Don Mario attraverso progetti concreti che portano speranza e opportunità alle comunità che ne hanno più bisogno.\n\nSosteniamo l'educazione e la formazione delle nuove generazioni a Bambuí.\nDiffondiamo la vita di Don Mario promuovendo la conoscenza della figura e delle opere del nostro fondatore.",
        align: "center",
        id: "text-1"
      }
    }
  ],
  root: {},
  zones: {}
};

async function seed() {
  const { data, error } = await supabase
    .from('pages')
    .update({ puck_data: puckData })
    .eq('slug', 'home');
    
  if (error) console.error("Error:", error);
  else console.log("Seeded successfully!");
}

seed();
