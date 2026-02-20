import { useState } from "react";
import { ShoppingCart, Minus, Plus, Trash2, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CartSheet() {
  const { items, updateQuantity, removeItem, clearCart, total, count } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!customerName.trim() || !whatsappNumber.trim()) {
      toast.error("Please fill in your name and WhatsApp number");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setSubmitting(true);
    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName.trim(),
          whatsapp_number: whatsappNumber.trim(),
          notes: notes.trim() || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(
          items.map(item => ({
            order_id: order.id,
            grocery_item_id: item.id,
            item_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            unit: item.unit,
          }))
        );

      if (itemsError) throw itemsError;

      toast.success("Order placed! We'll reach out on WhatsApp shortly. 🎉");
      clearCart();
      setCustomerName("");
      setWhatsappNumber("");
      setNotes("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="relative">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Your Shopping List</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Your cart is empty. Start adding items!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 mt-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">KSh {item.price}/{item.unit}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-heading text-lg">
              <span>Total</span>
              <span className="text-primary">KSh {total.toFixed(0)}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Jane" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="e.g. 0712345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any delivery preferences..." rows={2} />
            </div>

            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
