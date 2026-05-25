-- Setup database per Associazione Don Mario Gerlin Custom Admin Panel

-- 1. Tabella Photos (Galleria Foto)
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  url TEXT NOT NULL,
  caption TEXT NOT NULL,
  category TEXT NOT NULL -- "missione", "bambui", "eventi", "persone"
);

-- 2. Tabella Documents (Articoli PDF)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL
);

-- 3. Tabella Online Articles (Articoli Link)
CREATE TABLE IF NOT EXISTS public.online_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  source TEXT NOT NULL,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  url TEXT NOT NULL
);

-- 4. Tabella Events (Eventi)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  attachment_url TEXT -- PDF o volantino dell'evento
);

-- 5. Tabella Collaborations (Collaborazioni)
CREATE TABLE IF NOT EXISTS public.collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  attachment_url TEXT
);

-- Migrazione di sicurezza nel caso le colonne non esistano già
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.collaborations ADD COLUMN IF NOT EXISTS attachment_url TEXT;


-- Abilitazione Row Level Security (RLS)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Policies per Photos
DROP POLICY IF EXISTS "Public Read Photos" ON public.photos;
DROP POLICY IF EXISTS "Admin Access Photos" ON public.photos;
CREATE POLICY "Public Read Photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Admin Access Photos" ON public.photos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies per Documents
DROP POLICY IF EXISTS "Public Read Documents" ON public.documents;
DROP POLICY IF EXISTS "Admin Access Documents" ON public.documents;
CREATE POLICY "Public Read Documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Admin Access Documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies per Online Articles
DROP POLICY IF EXISTS "Public Read Online Articles" ON public.online_articles;
DROP POLICY IF EXISTS "Admin Access Online Articles" ON public.online_articles;
CREATE POLICY "Public Read Online Articles" ON public.online_articles FOR SELECT USING (true);
CREATE POLICY "Admin Access Online Articles" ON public.online_articles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies per Events
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Admin Access Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin Access Events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Policies per Collaborations
DROP POLICY IF EXISTS "Public Read Collaborazioni" ON public.collaborations;
DROP POLICY IF EXISTS "Admin Access Collaborazioni" ON public.collaborations;
CREATE POLICY "Public Read Collaborazioni" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Admin Access Collaborazioni" ON public.collaborations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Configurazione Storage Bucket 'media' per i caricamenti di PDF e Immagini
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies per il Bucket Storage 'media'
DROP POLICY IF EXISTS "Public Read Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Write Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Storage" ON storage.objects;

CREATE POLICY "Public Read Storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin Write Storage" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin Update Storage" ON storage.objects
  FOR UPDATE TO authenticated WITH CHECK (bucket_id = 'media');

CREATE POLICY "Admin Delete Storage" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media');

-- ==========================================
-- SEED DATA - DATI INIZIALI PRECARICATI
-- ==========================================

-- 1. Seed per Documents (PDF)
INSERT INTO public.documents (title, description, url) VALUES
('Don Gerlin Nelle Scuole', 'Articolo da ''L''Azione'' (2019)', '/documents/2019DonGerlinNelleScuoleAzione.pdf'),
('Premio Toniolo - Gazzettino', 'Articolo da ''Il Gazzettino'' (2019)', '/documents/2019PremioTonioloGazzettino.pdf'),
('Premio Toniolo - Tribuna', 'Articolo da ''La Tribuna'' (2019)', '/documents/2019PremioTonioloTribuna.pdf'),
('Articolo Bracelli', 'Archivio 2018', '/documents/2018bracelli.pdf'),
('L''Azione', 'Archivio 2013', '/documents/2013lazione.pdf'),
('L''Azione', 'Archivio 2010', '/documents/2010lazione.pdf'),
('Monte Calvario', 'Archivio 2010', '/documents/2010montecalvario.pdf'),
('La Nostra Pieve', 'Archivio 2009', '/documents/2009lanostrapieve.pdf'),
('La Sorgente', 'Archivio 2002', '/documents/2002lasorgente.pdf'),
('Mosaico', 'Archivio 1965', '/documents/1965mosaico.pdf')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed per Online Articles
INSERT INTO public.online_articles (source, date, title, description, tags, url) VALUES
('QdP News', '27 Febbraio 2023', '30° Anniversario della Morte', '"Italia e Brasile uniti nel ricordo di Don Mario Gerlin - Messa solenne con il Vescovo nell''Arcipretale diventata Duomo"', ARRAY['Commemorazione', 'Trentennale'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/italia-e-brasile-uniti-nel-trentennale-della-morte-di-don-mario-gerlin-messa-con-il-vescovo-nellarcipretale-diventata-duomo-20-anni-fa/'),
('Treviso Today', '15 Settembre 2022', 'Borse di Studio Internazionali', '"Gemellaggio educativo tra Pieve di Soligo e Bambuí: nuove opportunità per gli studenti grazie all''eredità di Don Mario"', ARRAY['Educazione', 'Gemellaggio'], 'https://www.trevisotoday.it/scuola/borse-studio-gemellaggio-don-mario-gerlin-pieve-di-soligo-.html'),
('QdP News', '27 Ottobre 2022', '103° Anniversario della Nascita', '"Celebrazioni internazionali per Don Mario Gerlin con ospiti d''eccezione: soprano giapponese dalla Fenice di Venezia"', ARRAY['Anniversario', 'Musica'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/103-anni-fa-nasceva-don-mario-gerlin-domani-sera-in-duomo-la-messa-in-suo-ricordo-ospite-deccezione-un-soprano-giapponese-dalla-fenice-di-venezia/'),
('QdP News', '2 Aprile 2022', 'Assemblea Annuale Associazione', '"Sabato 2 Aprile l''Assemblea annuale dell''Associazione Amici di Don Mario Gerlin: bilancio e nuovi progetti"', ARRAY['Associazione', 'Assemblea'], 'https://www.qdpnews.it/notizie-in-breve/02-04-sabato-2-aprile-lassemblea-annuale-dellassociazione-amici-di-don-mario-gerlin/'),
('QdP News', '28 Marzo 2022', 'Ricordo di Adriano Armelin', '"Il commosso ricordo degli Amici di Don Mario Gerlin per Adriano Armelin: una vita dedicata al servizio"', ARRAY['Memoria', 'Servizio'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/martedi-alle-15-in-duomo-a-pieve-di-soligo-i-funerali-di-adriano-armelin-il-commosso-ricordo-degli-amici-di-don-mario-gerlin/'),
('Treviso Today', '24 Febbraio 2021', 'Nuova Presidenza Associazione', '"Pierina Gerlin eletta nuova presidente dell''Associazione Amici di Don Mario Gerlin: continuità e innovazione"', ARRAY['Associazione', 'Nomina'], 'https://www.trevisotoday.it/info/amici-don-mario-gerlin-presidente-pieve-di-soligo-24-febbraio-2021.html'),
('QdP News', '27 Ottobre 2021', 'Messa in Ricordo di Don Mario', '"Santa Messa in Duomo a Pieve di Soligo in ricordo di Don Mario Gerlin con la Piccola Orchestra Veneta"', ARRAY['Memoria', 'Anniversario'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/pieve-di-soligo-domani-in-duomo-la-santa-messa-in-ricordo-di-don-mario-gerlin-intervento-musicale-della-piccola-orchestra-veneta/'),
('QdP News', '5 Giugno 2021', 'Testimonianze per Francesco Fabbri', '"Tante testimonianze per Francesco Fabbri: un esempio illustre di amore per la comunità e servizio al bene comune"', ARRAY['Comunità', 'Servizio'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/pieve-di-soligo-tante-testimonianze-per-francesco-fabbri-zabotti-esempio-illustre-di-amore-per-la-comunita-e-servizio-al-bene-comune/'),
('QdP News', '26 Febbraio 2021', 'Messa in Memoria', '"Messa in memoria di Don Mario Gerlin: ricordate anche le preziose collaboratrici suor Carmela e suor Alberta"', ARRAY['Memoria', 'Collaborazione'], 'https://www.qdpnews.it/comuni/pieve-di-soligo/pieve-di-soligo-questa-sera-in-duomo-la-messa-in-memoria-di-don-mario-gerlin-saranno-ricordate-anche-le-collaboratrici-suor-carmela-e-suor-alberta/')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed per Collaborazioni
INSERT INTO public.collaborations (title, description, url) VALUES
('Asilo Nido', 'Scopri le attività educative e i progetti di accoglienza per i bambini dell''asilo nido in Brasile.', 'https://www.facebook.com/share/1DB17ogw3J/'),
('Scuola Elementare', 'Scopri le iniziative, le lezioni e i progetti didattici dedicati ai bambini della scuola elementare in Brasile.', 'https://www.facebook.com/share/1BgUcLXJta/'),
('Associazione San Francesco d''Assisi', 'Segui le attività di solidarietà e i progetti di assistenza dell''Associazione Sociale San Francesco d''Assisi a Bambuí.', 'https://www.facebook.com/share/17x1euKRzC/')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed per Photos (Galleria Fotografica)
INSERT INTO public.photos (caption, category, url) VALUES
('Incontro tra le autorità e l''associazione', 'eventi', '/gallery/eventi/incontro tra le autorita e la associazzione.jpg'),
('Amici di Don Mario Gerlin', 'eventi', '/gallery/eventi/ass.jpg'),
('Consegna borse di studio', 'eventi', '/gallery/eventi/consegna borse di studio.jpg'),
('Corso di tessitura a Bambuí', 'eventi', '/gallery/eventi/corso di tessitura a bambui.jpg'),
('Borsa di studio', 'eventi', '/gallery/eventi/borsa di studio.jpg'),
('Scuola a Bambuí', 'bambui', '/gallery/bambui/scuola a bambui.jpg'),
('Istituzione Senar Minas per l''agricoltura', 'bambui', '/gallery/bambui/istituzione senar minas per l agricoltura.jpg'),
('Cimitero', 'bambui', '/gallery/bambui/cimitero.jpg'),
('Rovine di edificio', 'bambui', '/gallery/bambui/rovine di edificio.jpg'),
('Saldatori al lavoro a Bambuí', 'bambui', '/gallery/bambui/saldatori al lavoro a Bambui.jpg'),
('Uomo in sedia a rotelle al sanatorio', 'bambui', '/gallery/bambui/uomo in sedia a rotelle al sanatorio.jpg'),
('Albero di mango', 'bambui', '/gallery/bambui/albero di mango.jpg'),
('Strada malmessa', 'bambui', '/gallery/bambui/strada malmessa.jpg'),
('Scuola di Bambuí', 'bambui', '/gallery/bambui/scuola di Bambui.jpg'),
('Pianta di agave', 'bambui', '/gallery/bambui/pianta di agave.jpg'),
('Ospedale dedicato a Don Mario', 'bambui', '/gallery/bambui/ospedale dedicato a don Mario.jpg'),
('Campo incolto', 'bambui', '/gallery/bambui/campo incolto.jpg'),
('Intervento al sanatorio', 'bambui', '/gallery/bambui/intervento al sanatorio.jpg'),
('Struttura ospedaliera', 'bambui', '/gallery/bambui/struttura ospedaliera.jpg'),
('Edificio a Bambuí', 'bambui', '/gallery/bambui/edificio a bambui.jpg'),
('Bando messa 5 anni della morte della suora Maria Carmela Lombardi', 'missione', '/gallery/missione/bando messa 5 anni della morte della suora Maria Carmela Lombardi.jpg'),
('Funzione religiosa in Brasile', 'missione', '/gallery/missione/funzione religiosa in Brasile.jpg'),
('Don Mario affianco a un lebbroso', 'missione', '/gallery/missione/don Mario affianco a un lebroso.jpg'),
('Messa in una chiesa brasiliana', 'missione', '/gallery/missione/messa in una chiesa brasiliana.jpg'),
('Tomba di Don Mario Gerlin', 'missione', '/gallery/missione/tomba di don Mario Gerlin.jpg'),
('Messa funebre', 'missione', '/gallery/missione/messa funebre.jpg'),
('Bambini in chiesa durante la cerimonia commemorativa', 'persone', '/gallery/persone/bambini in chiesa durante la cerimonia commemorativa.jpg'),
('Bambini a messa a Bambuí', 'persone', '/gallery/persone/bambini a messa a Bambui.jpg'),
('Suora e fiori commemorativi', 'persone', '/gallery/persone/suora e fiori commemorativi.jpg'),
('Suora e membri dell''associazione', 'persone', '/gallery/persone/suora e membri dell associazione.jpg'),
('Studenti a scuola', 'persone', '/gallery/persone/studenti a scuola.jpg'),
('Suora e agricoltore', 'persone', '/gallery/persone/suora e agricoltore.jpg')
ON CONFLICT (id) DO NOTHING;

