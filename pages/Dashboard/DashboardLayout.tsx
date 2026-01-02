import { Outlet, Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, BookOpen, Video, Settings, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const token = localStorage.getItem("token");

    // Check both zustand state and localStorage
    if (!isAuthenticated || !token || user?.role !== 'admin') {
        console.log('[DashboardLayout] Not authenticated or not admin, redirecting to login');
        return <Navigate to="/dashboard/login" replace />;
    }

    const handleLogout = async () => {
        await logout();
        window.location.href = '/dashboard/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#120033] to-[#1a0a3e]">
            {/* Sidebar */}
            <aside className="fixed right-0 top-0 h-full w-64 bg-[#200f3f] border-l border-primary/20 p-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                    <p className="text-sm text-white/60 mt-1">{user?.name || user?.email}</p>
                </div>
                <nav className="space-y-2">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/20">
                            <LayoutDashboard className="ml-2 h-5 w-5" />
                            Overview
                        </Button>
                    </Link>
                    <Link to="/dashboard/rules">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/20">
                            <BookOpen className="ml-2 h-5 w-5" />
                            Rules
                        </Button>
                    </Link>
                    <Link to="/dashboard/users">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/20">
                            <Users className="ml-2 h-5 w-5" />
                            Users
                        </Button>
                    </Link>
                    <Link to="/dashboard/orders">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/20">
                            <ShoppingBag className="ml-2 h-5 w-5" />
                            Orders
                        </Button>
                    </Link>

                    <Link to="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/20">
                            <Settings className="ml-2 h-5 w-5" />
                            Settings
                        </Button>
                    </Link>
                </nav>
                <div className="absolute bottom-6 left-6 right-6">
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-start border-primary/20 text-white hover:bg-red-500/20"
                    >
                        <LogOut className="ml-2 h-5 w-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="mr-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}
