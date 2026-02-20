import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogIn, LogOut, ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

type GroceryItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  image_url: string | null;
  available: boolean;
  stock_quantity: number;
};

type Order = {
  id: string;
  customer_name: string;
  whatsapp_number: string;
  status: string;
  notes: string | null;
  created_at: string;
  order_items: {
    id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
    unit: string;
  }[];
};

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Meat", "Grains", "Beverages", "Snacks", "General"];

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center mb-6">
          <span className="text-3xl">🥦</span>
          <h1 className="font-heading text-2xl mt-2">Admin Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            <LogIn className="w-4 h-4 mr-2" />
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ItemForm({
  item,
  onSave,
  onClose,
}: {
  item?: GroceryItem;
  onSave: () => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [price, setPrice] = useState(item?.price?.toString() || "");
  const [unit, setUnit] = useState(item?.unit || "kg");
  const [category, setCategory] = useState(item?.category || "General");
  const [imageUrl, setImageUrl] = useState(item?.image_url || "");
  const [stockQuantity, setStockQuantity] = useState(item?.stock_quantity?.toString() || "0");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: parseFloat(price),
      unit,
      category,
      image_url: imageUrl.trim() || null,
      stock_quantity: parseInt(stockQuantity) || 0,
    };

    if (item) {
      const { error } = await supabase.from("grocery_items").update(payload).eq("id", item.id);
      if (error) toast.error("Update failed");
      else toast.success("Item updated");
    } else {
      const { error } = await supabase.from("grocery_items").insert(payload);
      if (error) toast.error("Failed to add item");
      else toast.success("Item added");
    }

    setSaving(false);
    onSave();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price (KSh)</Label>
          <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <Label>Unit</Label>
          <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="kg, piece, bunch..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Stock Qty</Label>
          <Input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Image URL (optional)</Label>
        <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
      </div>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Saving..." : item ? "Update Item" : "Add Item"}
      </Button>
    </form>
  );
}

export default function Admin() {
  const [session, setSession] = useState<boolean | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editItem, setEditItem] = useState<GroceryItem | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_, s) => {
      setSession(!!s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session);
    });
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from("grocery_items").select("*").order("category").order("name");
    if (data) setItems(data as GroceryItem[]);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  useEffect(() => {
    if (session) {
      fetchItems();
      fetchOrders();
    }
  }, [session]);

  const toggleAvailable = async (item: GroceryItem) => {
    await supabase.from("grocery_items").update({ available: !item.available }).eq("id", item.id);
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await supabase.from("grocery_items").delete().eq("id", id);
    fetchItems();
    toast.success("Item deleted");
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    fetchOrders();
    toast.success(`Order marked as ${status}`);
  };

  if (session === null) return null;
  if (!session) return <AdminLogin onLogin={() => setSession(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <h1 className="font-heading text-xl">Admin Panel</h1>
          </div>
          <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <div className="container py-6">
        <Tabs defaultValue="items">
          <TabsList className="mb-6">
            <TabsTrigger value="items">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg">Grocery Items</h2>
              <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditItem(undefined); }}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle className="font-heading">{editItem ? "Edit Item" : "Add New Item"}</DialogTitle></DialogHeader>
                  <ItemForm item={editItem} onSave={fetchItems} onClose={() => setDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      KSh {item.price}/{item.unit} · {item.category} · Stock: {item.stock_quantity}
                    </p>
                  </div>
                  <Switch checked={item.available} onCheckedChange={() => toggleAvailable(item)} />
                  <Button size="icon" variant="ghost" onClick={() => { setEditItem(item); setDialogOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No items yet. Add your first grocery item!</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 rounded-lg border bg-card space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <a
                        href={`https://wa.me/${order.whatsapp_number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        {order.whatsapp_number}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'pending' ? 'bg-secondary/20 text-secondary-foreground' :
                        order.status === 'confirmed' ? 'bg-primary/20 text-accent-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded p-2">
                    {order.order_items.map(oi => (
                      <div key={oi.id} className="flex justify-between text-sm py-0.5">
                        <span>{oi.item_name} × {oi.quantity}</span>
                        <span className="text-muted-foreground">KSh {(oi.unit_price * oi.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium text-sm pt-1 border-t mt-1">
                      <span>Total</span>
                      <span>KSh {order.order_items.reduce((s, i) => s + i.unit_price * i.quantity, 0).toFixed(0)}</span>
                    </div>
                  </div>

                  {order.notes && <p className="text-sm text-muted-foreground italic">"{order.notes}"</p>}

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>Confirm</Button>
                      <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</Button>
                    </div>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'delivered')}>Mark Delivered</Button>
                  )}
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No orders yet.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
