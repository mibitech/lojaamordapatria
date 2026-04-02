-- Create storage bucket for study documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('study-documents', 'study-documents', false);

-- Create table for study works
CREATE TABLE public.study_works (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brother_name TEXT NOT NULL,
  work_title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  upload_date DATE NOT NULL DEFAULT CURRENT_DATE,
  uploaded_by UUID REFERENCES auth.users(id),
  description TEXT,
  category TEXT DEFAULT 'geral',
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.study_works ENABLE ROW LEVEL SECURITY;

-- Create policies for study_works table
CREATE POLICY "Study works are viewable by authenticated users" 
ON public.study_works 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can upload study works" 
ON public.study_works 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own study works" 
ON public.study_works 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

-- Create storage policies for study documents
CREATE POLICY "Study documents are viewable by authenticated users" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'study-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can upload study documents" 
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

-- Create trigger for updating updated_at
CREATE TRIGGER update_study_works_updated_at
  BEFORE UPDATE ON public.study_works
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();