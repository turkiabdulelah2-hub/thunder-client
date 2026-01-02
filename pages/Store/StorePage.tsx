import { useEffect, useState } from "react";
import { useStoreStore } from "@/stores/storeStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import ItemCard from "@/components/Store/ItemCard";
import CartDrawer from "@/components/Store/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, ShoppingBag, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function StorePage() {
    const { items, fetchItems, loading } = useStoreStore();
    const { openCart, items: cartItems } = useCartStore();
    const { isAuthenticated, user } = useAuthStore();
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchItems(1, 12, { search, minPrice, maxPrice });
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, minPrice, maxPrice]);

    return (
        <div className="min-h-screen bg-background pt-24 pb-10 px-4 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#120033] opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-heading">
                            Respect <span className="text-primary">Store</span>
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Buy and sell items within the community
                        </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="flex gap-2 items-center bg-card/50 p-1 rounded-lg border border-border/50 backdrop-blur-sm">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search items..."
                                    className="pl-9 w-[200px] md:w-[300px] bg-transparent border-none focus-visible:ring-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-[1px] bg-border" />
                            <Input
                                placeholder="Min"
                                type="number"
                                className="w-20 bg-transparent border-none focus-visible:ring-0 text-center px-1"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                placeholder="Max"
                                type="number"
                                className="w-20 bg-transparent border-none focus-visible:ring-0 text-center px-1"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="relative"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Cart
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItems.length}
                                </span>
                            )}
                        </Button>

                        {isAuthenticated && user?.role === 'admin' && (
                            <Button className="btn-neon" asChild>
                                <Link to="/store/create">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Item
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-card/30 rounded-xl border border-border/50">
                        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-bold mb-2">No items found</h3>
                        <p className="text-muted-foreground mb-6">
                            {search || minPrice || maxPrice ? "Try adjusting your filters" : "Be the first to list an item!"}
                        </p>
                        {isAuthenticated && user?.role === 'admin' && (
                            <Button className="btn-neon" asChild>
                                <Link to="/store/create">List Item</Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item, index) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ItemCard item={item} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <CartDrawer />
        </div>
    );
}
