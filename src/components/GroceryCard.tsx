import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

type GroceryCardProps = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  image_url: string | null;
};

export function GroceryCard({ id, name, description, price, unit, image_url }: GroceryCardProps) {
  const { items, addItem } = useCart();
  const inCart = items.some(i => i.id === id);

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden transition-shadow hover:shadow-lg animate-fade-in">
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {image_url ? (
          <img src={image_url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🥬</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg text-card-foreground">{name}</h3>
        {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary font-semibold text-lg">
            UGX {price.toFixed(0)}<span className="text-sm text-muted-foreground font-normal">/{unit}</span>
          </span>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            onClick={() => addItem({ id, name, price, unit })}
          >
            {inCart ? <><Check className="w-4 h-4 mr-1" /> Added</> : <><Plus className="w-4 h-4 mr-1" /> Add</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
