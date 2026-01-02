import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { forgotPassword, loading } = useAuthStore();
    const [formData, setFormData] = useState({
        email: "",
        slug: "",
    });
    const [resetLink, setResetLink] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLink(null);
        setError(null);
        try {
            const result = await forgotPassword(formData.email, formData.slug);

            if (result.data && result.data.devLink) {
                toast.success("Redirecting to reset password...");
                // Extract the path from the full URL if needed, or just use the relative path
                // Assuming devLink is like "/reset-password/..."
                navigate(result.data.devLink);
            } else {
                toast.success("Reset link sent to your email!");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to request password reset";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center p-4 py-20 relative overflow-hidden w-full h-full flex-grow">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[#120033] opacity-90" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email and slug to reset your password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={loading}
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (Security ID)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="username-xyz"
                                    required
                                    disabled={loading}
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="bg-background/50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This is your unique security identifier generated at registration.
                                </p>
                            </div>

                            <Button type="submit" className="w-full btn-neon" disabled={loading}>
                                {loading ? "Verifying..." : "Get Reset Link"}
                            </Button>
                        </form>

                        {resetLink && (
                            <Alert className="mt-4 border-primary/50 bg-primary/10">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>Dev Mode: Reset Link</AlertTitle>
                                <AlertDescription className="break-all">
                                    <Link to={resetLink} className="underline text-primary hover:text-primary/80">
                                        Click here to reset password
                                    </Link>
                                </AlertDescription>
                            </Alert>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        <Link to="/signin" className="hover:text-foreground transition-colors">
                            Back to Sign In
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
