import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/imageUtils";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useStoreStore } from "@/stores/storeStore";
import { Trash2, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ItemCardProps {
    item: {
        _id: string;
        title: string;
        description: string;
        price: number;
        image: string;
        seller: {
            _id: string;
            name: string;
            avatar?: string;
        };
        createdAt: string;
    };
}

export default function ItemCard({ item }: ItemCardProps) {
    const { user } = useAuthStore();
    const { addToCart } = useCartStore();
    const { deleteItem } = useStoreStore();

    const isSeller = user?.id === item.seller._id;
    const isAdmin = user?.role === 'admin';

    const handleAddToCart = () => {
        addToCart({
            _id: item._id,
            title: item.title,
            price: item.price,
            image: item.image,
            sellerName: item.seller.name
        });
        toast.success("Added to cart");
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteItem(item._id);
                toast.success("Item deleted");
            } catch (error) {
                toast.error("Failed to delete item");
            }
        }
    };

    return (
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all duration-300">
            <div className="aspect-square relative overflow-hidden">
                <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2">
                    <Badge className="bg-background/80 backdrop-blur text-foreground border-primary/20">
                        ${item.price}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                    {item.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/30">
                    <Link to={`/profile/${item.seller._id}`} className="flex items-center gap-2 hover:text-primary transition-colors group/seller">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20 group-hover/seller:border-primary/50 transition-colors">
                            <img
                                src={getImageUrl(item.seller.avatar)}
                                alt={item.seller.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.seller.name)}&background=random`;
                                }}
                            />
                        </div>
                        <span className="font-medium">{item.seller.name}</span>
                    </Link>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                    className="flex-1 gap-2 btn-neon"
                    onClick={handleAddToCart}
                    size="sm"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </Button>

                {isAdmin && (
                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
