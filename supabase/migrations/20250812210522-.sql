-- Update the trigger function to set new users as 'visitor' instead of 'member'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    'visitor'  -- Changed from 'member' to 'visitor'
  );
  RETURN NEW;
END;
$function$