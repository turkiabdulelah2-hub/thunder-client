import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Package, User as UserIcon, Mail, Calendar, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageUrl } from "@/lib/imageUtils";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
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
    updatedAt?: string;
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data.data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
        }
    };

    const isBuyer = user?.id === order.buyer._id;
    const otherParty = isBuyer ? order.seller : order.buyer;
    const roleLabel = isBuyer ? "Seller" : "Buyer";

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'cancelled': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    return (
        <div className="container py-10 max-w-5xl space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="pl-0 hover:pl-1 transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        Order <span className="font-mono text-primary">#{order.orderNumber}</span>
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    {order.status === 'completed' && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed on {format(new Date(order.updatedAt || order.createdAt), "MMM d, yyyy")}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Package className="w-5 h-5 text-primary" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {order.items.map((item, index) => (
                                    <div key={index} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:bg-muted/20 transition-colors">
                                        <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                            <img
                                                src={getImageUrl(item.item?.image)}
                                                alt={item.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-semibold text-lg">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">Unit Price: ${item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right min-w-[100px]">
                                            <p className="text-sm text-muted-foreground mb-1">Qty: {item.quantity}</p>
                                            <p className="font-bold text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-muted/30 p-6 flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Taxes & Fees</span>
                                    <span>$0.00</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-2xl text-primary">${order.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                    {/* User Details Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <UserIcon className="w-5 h-5 text-primary" />
                                {roleLabel} Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-16 w-16 border-2 border-primary/10">
                                    <AvatarImage src={getImageUrl(otherParty.avatar)} />
                                    <AvatarFallback className="text-lg">{otherParty.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-lg">{otherParty.name}</p>
                                    <Badge variant="outline" className="mt-1 capitalize">{roleLabel}</Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs text-muted-foreground mb-0.5">Email Address</p>
                                        <a href={`mailto:${otherParty.email}`} className="text-sm font-medium hover:text-primary transition-colors truncate block">
                                            {otherParty.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Info Card */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Payment Method</span>
                                <span className="font-medium">Credits / Balance</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Payment Status</span>
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                    Paid
                                </Badge>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Transaction Date</span>
                                <span className="text-sm font-medium">{format(new Date(order.createdAt), "MMM d, yyyy")}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
