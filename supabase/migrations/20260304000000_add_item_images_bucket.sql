-- Create a public storage bucket for grocery item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload item images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

-- Allow authenticated users to update/replace their uploads
CREATE POLICY "Authenticated users can update item images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'item-images');

-- Allow authenticated users to delete item images
CREATE POLICY "Authenticated users can delete item images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-images');

-- Allow public read access to item images
CREATE POLICY "Public can view item images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');
