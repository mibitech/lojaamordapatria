-- Add commission flag to profiles table
ALTER TABLE public.profiles ADD COLUMN is_commission_member boolean DEFAULT false;