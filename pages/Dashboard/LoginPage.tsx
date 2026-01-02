import { SEO } from "@/components/SEO/SEO";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { adminLogin, loading, error, clearError, isAuthenticated, user } = useAuthStore();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            console.log('[Login] Already authenticated, redirecting to dashboard');
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        console.log('[Login] Attempting login for:', email);

        try {
            await adminLogin(email, password);
            toast.success("Login successful!");
            console.log('[Login] Login successful, navigating to dashboard');
            navigate("/dashboard", { replace: true });
        } catch (err: any) {
            console.error('[Login] Login failed:', err);
            toast.error(error || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#120033] to-[#1a0a3e] p-4">
            <SEO
                title="تسجيل الدخول"
                description="تسجيل الدخول إلى لوحة التحكم"
                noIndex={true}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="bg-[#200f3f] border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center text-white">
                            Admin Dashboard
                        </CardTitle>
                        <p className="text-center text-white/60 text-sm mt-2">
                            Sign in to manage your application
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-[#2a174b] border-primary/20 text-white placeholder:text-white/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        className="bg-[#2a174b] border-primary/20 text-white placeholder:text-white/40 pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/60 hover:text-white"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Hide password" : "Show password"}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-500 text-sm">{error}</p>
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
