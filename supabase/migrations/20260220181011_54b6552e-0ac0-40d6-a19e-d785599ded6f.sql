
-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.grocery_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.grocery_items TO authenticated;
