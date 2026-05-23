-- setup_rls.sql
-- We need to add basic policies so our frontend and the seeder can read/write data using the anon key.

-- Allow read access to anyone
CREATE POLICY "Allow public read access for folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Allow public read access for decks" ON public.decks FOR SELECT USING (true);
CREATE POLICY "Allow public read access for flashcards" ON public.flashcards FOR SELECT USING (true);

-- Allow insert access for development testing (You can restrict this later to authenticated users)
CREATE POLICY "Allow public insert access for folders" ON public.folders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access for decks" ON public.decks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access for flashcards" ON public.flashcards FOR INSERT WITH CHECK (true);
