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
      <div className="p-3">
        <h3 className="font-heading text-sm sm:text-base text-card-foreground leading-tight line-clamp-2">{name}</h3>
        {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">{description}</p>}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-primary font-semibold text-sm sm:text-base">
            UGX {price.toLocaleString()}<span className="text-xs text-muted-foreground font-normal">/{unit}</span>
          </span>
          <Button
            size="sm"
            variant={inCart ? "secondary" : "default"}
            className="w-full text-xs sm:text-sm"
            onClick={() => addItem({ id, name, price, unit })}
          >
            {inCart ? <><Check className="w-3 h-3 mr-1" /> Added</> : <><Plus className="w-3 h-3 mr-1" /> Add to Cart</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
