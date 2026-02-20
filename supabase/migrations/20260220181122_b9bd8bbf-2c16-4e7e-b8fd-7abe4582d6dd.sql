
-- Allow anon to read back their just-inserted order
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
CREATE POLICY "Anyone can view their order"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (true);

-- Same for order_items
DROP POLICY IF EXISTS "Authenticated users can view order items" ON public.order_items;
CREATE POLICY "Anyone can view order items"
ON public.order_items
FOR SELECT
TO anon, authenticated
USING (true);
