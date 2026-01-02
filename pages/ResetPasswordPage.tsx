import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuthStore();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            const msg = "Passwords do not match";
            setError(msg);
            toast.error(msg);
            return;
        }
        if (!token) {
            const msg = "Invalid reset token";
            setError(msg);
            toast.error(msg);
            return;
        }

        try {
            await resetPassword(token, password);
            toast.success("Password reset successful! Please login.");
            navigate("/signin");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to reset password";
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
                        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your new password below
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
                                <Label htmlFor="password">New Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    disabled={loading}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    disabled={loading}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    className="bg-background/50"
                                />
                            </div>

                            <Button type="submit" className="w-full btn-neon" disabled={loading}>
                                {loading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
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
