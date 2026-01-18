-- Add full_name column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN full_name TEXT NOT NULL DEFAULT '';

-- Update the column to remove default after adding (allows existing rows to have empty string)
ALTER TABLE public.profiles 
ALTER COLUMN full_name DROP DEFAULT;