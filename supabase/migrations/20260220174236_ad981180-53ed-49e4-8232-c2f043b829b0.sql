
-- Grocery items table
CREATE TABLE public.grocery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  category TEXT NOT NULL DEFAULT 'General',
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view available items
CREATE POLICY "Anyone can view grocery items"
ON public.grocery_items FOR SELECT
USING (true);

-- Only authenticated users can manage items (admin)
CREATE POLICY "Authenticated users can insert items"
ON public.grocery_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update items"
ON public.grocery_items FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete items"
ON public.grocery_items FOR DELETE
TO authenticated
USING (true);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Only authenticated can view/manage orders
CREATE POLICY "Authenticated users can view orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  grocery_item_id UUID NOT NULL REFERENCES public.grocery_items(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Anyone can insert order items (when creating order)
CREATE POLICY "Anyone can create order items"
ON public.order_items FOR INSERT
WITH CHECK (true);

-- Only authenticated can view order items
CREATE POLICY "Authenticated users can view order items"
ON public.order_items FOR SELECT
TO authenticated
USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_grocery_items_updated_at
BEFORE UPDATE ON public.grocery_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
