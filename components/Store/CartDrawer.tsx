import { useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/stores/cartStore";
import { getImageUrl } from "@/lib/imageUtils";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeFromCart, getTotal, clearCart, fetchCart } = useCartStore();

    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, fetchCart]);

    const handleCheckout = async () => {
        if (items.length === 0) return;

        try {
            const axiosInstance = (await import('@/lib/axios')).default;
            await axiosInstance.post('/orders/checkout');
            toast.success("Order placed successfully!");
            clearCart();
            closeCart();
            window.dispatchEvent(new Event("order-created"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to place order");
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={closeCart}>
            <SheetContent className="w-full sm:w-[400px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        Your Cart ({items.length})
                    </SheetTitle>
                </SheetHeader>

                <ScrollArea className="flex-1 my-4 pr-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-3 items-start bg-muted/30 p-3 rounded-lg">
                                    <div className="w-16 h-16 rounded overflow-hidden bg-background flex-shrink-0">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">Seller: {item.sellerName}</p>
                                        <p className="text-primary font-bold mt-1">${item.price}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeFromCart(item._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <SheetFooter className="flex-col gap-3 sm:flex-col border-t pt-4">
                    <div className="flex justify-between items-center w-full text-lg font-bold">
                        <span>Total:</span>
                        <span>${getTotal()}</span>
                    </div>
                    <Button
                        className="w-full btn-neon"
                        disabled={items.length === 0}
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                    {items.length > 0 && (
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
