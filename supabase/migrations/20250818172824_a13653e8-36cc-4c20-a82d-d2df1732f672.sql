-- Add masonic_degree column to study_works table
ALTER TABLE public.study_works 
ADD COLUMN masonic_degree integer NOT NULL DEFAULT 1;

-- Update existing records with masonic degree from profiles
UPDATE public.study_works 
SET masonic_degree = profiles.masonic_degree 
FROM public.profiles 
WHERE study_works.uploaded_by = profiles.user_id;