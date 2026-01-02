import { SEO } from "@/components/SEO/SEO";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Loader2, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";

interface Statistics {
    rules: {
        totalRules: number;
        activeRules: number;
        inactiveRules: number;
    };
    users: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        adminUsers: number;
        regularUsers: number;
    };
}

export default function OverviewPage() {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const [rulesRes, usersRes] = await Promise.all([
                axios.get("/rules/admin/statistics"),
                axios.get("/users/statistics")
            ]);

            setStats({
                rules: rulesRes.data.data,
                users: usersRes.data.data
            });
        } catch (error: any) {
            console.error("Error fetching statistics:", error);
            setError(error.response?.data?.message || "Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <SEO
                title="لوحة التحكم"
                description="لوحة تحكم الإدارة"
                noIndex={true}
            />
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                    <p className="text-white/60">Manage your content and track statistics</p>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                    <Activity className="h-5 w-5" />
                    <span className="text-sm">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Content"
                    value={(stats?.rules.totalRules || 0) + (stats?.users.totalUsers || 0)}
                    icon={<TrendingUp className="h-8 w-8" />}
                    color="purple"
                    subtitle="Combined items"
                />
                <StatCard
                    title="Active Rules"
                    value={stats?.rules.activeRules || 0}
                    icon={<BookOpen className="h-8 w-8" />}
                    color="green"
                    subtitle={`${stats?.rules.totalRules || 0} total`}
                />
                <StatCard
                    title="Active Users"
                    value={stats?.users.activeUsers || 0}
                    icon={<Video className="h-8 w-8" />}
                    color="blue"
                    subtitle={`${stats?.users.totalUsers || 0} total`}
                />
                <StatCard
                    title="Inactive Items"
                    value={(stats?.rules.inactiveRules || 0) + (stats?.users.inactiveUsers || 0)}
                    icon={<Activity className="h-8 w-8" />}
                    color="red"
                    subtitle="Needs attention"
                />
            </div>

            {/* Rules Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-[#200f3f] border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                            <BookOpen className="h-6 w-6 text-primary" />
                            Rules Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Total Rules</p>
                                <p className="text-3xl font-bold text-white">{stats?.rules.totalRules || 0}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Active</p>
                                <p className="text-3xl font-bold text-green-500">{stats?.rules.activeRules || 0}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Inactive</p>
                                <p className="text-3xl font-bold text-red-500">{stats?.rules.inactiveRules || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Users Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-[#200f3f] border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white flex items-center gap-3">
                            <Video className="h-6 w-6 text-primary" />
                            Users Management
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-white">{stats?.users.totalUsers || 0}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Active</p>
                                <p className="text-3xl font-bold text-green-500">{stats?.users.activeUsers || 0}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[#2a174b]">
                                <p className="text-white/60 text-sm mb-1">Inactive</p>
                                <p className="text-3xl font-bold text-red-500">{stats?.users.inactiveUsers || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, icon, color, subtitle }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
}) {
    const colorClasses = {
        blue: "text-blue-500",
        green: "text-green-500",
        red: "text-red-500",
        purple: "text-purple-500"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            <Card className="bg-[#200f3f] border-primary/20 hover:border-primary/50 transition-all h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-white/70 mb-1">
                            {title}
                        </CardTitle>
                        {subtitle && (
                            <p className="text-xs text-white/40">{subtitle}</p>
                        )}
                    </div>
                    <div className={colorClasses[color as keyof typeof colorClasses]}>
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-white">{value}</div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
