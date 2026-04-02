-- Add policies for commission members to manage data

-- Events policies for commission members
CREATE POLICY "Commission members can insert events" 
ON public.events 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can update events" 
ON public.events 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can delete events" 
ON public.events 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

-- Activities policies for commission members
CREATE POLICY "Commission members can insert activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can update activities" 
ON public.activities 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can delete activities" 
ON public.activities 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

-- Worshipful Masters policies for commission members
CREATE POLICY "Commission members can insert worshipful masters" 
ON public.worshipful_masters 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can update worshipful masters" 
ON public.worshipful_masters 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

CREATE POLICY "Commission members can delete worshipful masters" 
ON public.worshipful_masters 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND is_commission_member = true
  )
);

-- Profiles policies for commission members (they can already select, just need update)
CREATE POLICY "Commission members can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.is_commission_member = true
  )
);