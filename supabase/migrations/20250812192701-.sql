-- Create the study-documents storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-documents', 'study-documents', false);

-- Create storage policies for study-documents bucket
CREATE POLICY "Users can view their own study documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'study-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own study documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'study-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own study documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'study-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own study documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'study-documents' AND auth.uid()::text = (storage.foldername(name))[1]);