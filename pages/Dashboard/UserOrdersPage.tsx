import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Package, ShoppingBag, ExternalLink, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/imageUtils";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/authStore";

interface OrderItem {
    _id: string;
    title: string;
    price: number;
    quantity: number;
    item: {
        _id: string;
        title: string;
        image: string;
    };
}

interface Order {
    _id: string;
    orderNumber: string;
    buyer: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
    seller: {
        _id: string;
        name: string;
        email: string;
        avatar: string;
    };
    items: OrderItem[];
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: string;
    isReadByBuyer: boolean;
    isReadBySeller: boolean;
}

export default function UserOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
        markAsRead();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/my-orders");
            setOrders(response.data.data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await api.put("/orders/mark-read");
            // Trigger a custom event or update store to refresh badge if needed
            // For now, we rely on the Header component polling or re-fetching
        } catch (error) {
            console.error("Failed to mark orders as read:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
            default:
                return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
        }
    };

    if (loading) {
        return (
            <div className="container py-10 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                    <p className="text-muted-foreground mt-2">
                        View and manage your purchases and sales.
                    </p>
                </div>
            </div>

            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Order History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No orders found.</p>
                            <Button asChild className="mt-4 btn-neon">
                                <Link to="/store">Browse Store</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="rounded-md border border-primary/10 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-primary/5">
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Other Party</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => {
                                        const isBuyer = user?.id === order.buyer._id;
                                        const otherParty = isBuyer ? order.seller : order.buyer;
                                        const role = isBuyer ? "Buyer" : "Seller";

                                        return (
                                            <TableRow
                                                key={order._id}
                                                className="hover:bg-primary/5 transition-colors cursor-pointer"
                                                onClick={() => navigate(`/my-orders/${order._id}`)}
                                            >
                                                <TableCell className="font-mono font-medium">
                                                    #{order.orderNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={isBuyer ? "border-blue-500 text-blue-500" : "border-purple-500 text-purple-500"}>
                                                        {role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="h-8 w-8 border border-primary/20">
                                                            <AvatarImage src={getImageUrl(otherParty.avatar)} />
                                                            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{otherParty.name}</span>
                                                            <span className="text-xs text-muted-foreground">{otherParty.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        {order.items.map((item, idx) => (
                                                            <div key={idx} className="text-sm flex items-center gap-2">
                                                                <span className="text-muted-foreground">{item.quantity}x</span>
                                                                <span>{item.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-primary">
                                                    ${order.totalPrice.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusColor(order.status)} variant="secondary">
                                                        {order.status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
