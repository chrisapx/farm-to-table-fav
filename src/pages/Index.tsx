import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GroceryCard } from "@/components/GroceryCard";
import { CartSheet } from "@/components/CartSheet";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";

type GroceryItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  image_url: string | null;
  available: boolean;
};

const Index = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("grocery_items")
        .select("*")
        .eq("available", true)
        .order("category")
        .order("name");
      if (!error && data) setItems(data as GroceryItem[]);
      setLoading(false);
    };
    fetchItems();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🥦</span>
            <h1 className="font-heading text-xl text-foreground">FreshCart</h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
            <CartSheet />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-accent/50 py-12 md:py-16">
        <div className="container text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
            Fresh Groceries, Delivered
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Browse our selection, add to your list, and we'll reach out on WhatsApp to confirm your order.
          </p>
          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="container mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="container py-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-5xl mb-4">🫠</p>
            <p>No items found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <GroceryCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </main>
      <WhatsAppButton />
    </div>
  );
};

export default Index;
