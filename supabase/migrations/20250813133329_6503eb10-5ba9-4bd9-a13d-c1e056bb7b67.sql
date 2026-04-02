-- Add masonic_degree column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN masonic_degree integer NOT NULL DEFAULT 1;

-- Add check constraint to ensure only values 1, 2, 3 are allowed
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_masonic_degree_check 
CHECK (masonic_degree IN (1, 2, 3));