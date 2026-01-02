import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "@/lib/axios";
import { getImageUrl } from "@/lib/imageUtils";
import {
    Loader2,
    LogOut,
    Save,
    Shield,
    User as UserIcon,
    Camera,
    Twitter,
    Instagram,
    Gamepad2,
    Globe,
    Package
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    slug?: string;
    socialLinks?: {
        twitter?: string;
        instagram?: string;
        discord?: string;
        [key: string]: string | undefined;
    };
    role: string;
}

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, logout, setUser } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state for editing
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        twitter: "",
        instagram: "",
        discord: ""
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                let userId = id;

                if (!userId) {
                    if (currentUser) {
                        userId = currentUser.id;
                        window.history.replaceState(null, "", `/profile/${userId}`);
                    } else {
                        navigate("/signin");
                        return;
                    }
                }

                const isMyProfile = currentUser?.id === userId;
                setIsOwner(isMyProfile);

                let data;
                if (isMyProfile) {
                    const res = await axios.get('/auth/profile');
                    data = res.data.data;
                } else {
                    // TODO: Implement public user endpoint
                    try {
                        const res = await axios.get(`/users/public/${userId}`);
                        data = res.data.data;
                    } catch (e) {
                        // Fallback for demo if endpoint missing
                        if (isMyProfile) {
                            // Should not happen if auth/profile works
                            throw e;
                        }
                        // Mock data for non-existent public endpoint
                        console.warn("Public profile fetch failed");
                        throw new Error("User not found");
                    }
                }

                setProfile({
                    id: data._id || data.id,
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar,
                    bio: data.bio,
                    slug: data.slug,
                    socialLinks: data.socialLinks,
                    role: data.role
                });

                setFormData({
                    name: data.name || "",
                    bio: data.bio || "",
                    twitter: data.socialLinks?.twitter || "",
                    instagram: data.socialLinks?.instagram || "",
                    discord: data.socialLinks?.discord || ""
                });

            } catch (error) {
                toast.error("Failed to load profile");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, currentUser, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        toast.success("Logged out successfully");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("bio", formData.bio);

            // Handle social links - send as JSON string for FormData
            const socialLinks = {
                twitter: formData.twitter,
                instagram: formData.instagram,
                discord: formData.discord
            };
            data.append("socialLinks", JSON.stringify(socialLinks));

            if (avatarFile) {
                data.append("avatar", avatarFile);
            }

            const res = await axios.put('/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const updatedUser = res.data.data;

            // Update local state
            setProfile({
                ...profile!,
                name: updatedUser.name,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar,
                socialLinks: updatedUser.socialLinks
            });

            // Update global store if it's my profile
            if (currentUser && currentUser.id === profile?.id) {
                // We need to construct the User object for the store
                const storeUser = {
                    id: updatedUser._id || updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    avatar: updatedUser.avatar,
                    bio: updatedUser.bio,
                    slug: updatedUser.slug,
                    socialLinks: updatedUser.socialLinks
                };
                const token = localStorage.getItem('token');
                if (token) {
                    setUser(storeUser, token);
                }
            }

            toast.success("Profile updated successfully");
            setIsEditing(false);
            setAvatarFile(null);
            setPreviewAvatar(null);
        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'twitter': return <Twitter className="h-4 w-4" />;
            case 'instagram': return <Instagram className="h-4 w-4" />;
            case 'discord': return <Gamepad2 className="h-4 w-4" />;
            default: return <Globe className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-background pt-24 pb-10 px-4">
            <div className="container max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="bg-card/50 backdrop-blur-xl border-border/50 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                            {isOwner && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-4 right-4 gap-2"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            )}
                        </div>

                        <CardContent className="relative pt-0">
                            <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
                                <div className="relative group">
                                    <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                                        <AvatarImage
                                            src={previewAvatar || getImageUrl(profile.avatar)}
                                            alt={profile.name}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-4xl bg-muted">{profile.name[0]}</AvatarFallback>
                                    </Avatar>

                                    {isEditing && (
                                        <div
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Camera className="h-8 w-8 text-white" />
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 pt-14 md:pt-12 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                                {profile.name}
                                                {profile.role === 'admin' && <Shield className="h-5 w-5 text-primary" />}
                                            </h1>
                                            <p className="text-muted-foreground">{profile.email}</p>
                                        </div>
                                        {isOwner && !isEditing && (
                                            <div className="flex gap-2">
                                                <Button variant="outline" asChild>
                                                    <Link to="/my-orders">
                                                        <Package className="mr-2 h-4 w-4" />
                                                        My Orders
                                                    </Link>
                                                </Button>
                                                <Button onClick={() => setIsEditing(true)} variant="outline">
                                                    Edit Profile
                                                </Button>
                                            </div>
                                        )}
                                        {isOwner && isEditing && (
                                            <div className="flex gap-2">
                                                <Button variant="ghost" onClick={() => {
                                                    setIsEditing(false);
                                                    setPreviewAvatar(null);
                                                    setAvatarFile(null);
                                                }}>Cancel</Button>
                                                <Button onClick={handleSave} className="gap-2">
                                                    <Save className="h-4 w-4" /> Save
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {!isEditing ? (
                                        <p className="text-lg mt-4">{profile.bio || "No bio yet."}</p>
                                    ) : (
                                        <div className="space-y-4 mt-4">
                                            <div className="grid gap-2">
                                                <Label>Display Name</Label>
                                                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Bio</Label>
                                                <Input value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator className="my-8" />

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Security Section - Owner Only */}
                                {isOwner && (
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-semibold flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            Security
                                        </h3>
                                        <Card className="bg-background/50 border-border/50">
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs uppercase text-muted-foreground">Security Slug (Private)</Label>
                                                    <div className="font-mono bg-muted p-2 rounded text-sm break-all">
                                                        {profile.slug}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Keep this safe! You need it to reset your password.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Social Links */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <UserIcon className="h-5 w-5 text-primary" />
                                        Social Links
                                    </h3>
                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="grid gap-1">
                                                <Label className="text-xs flex items-center gap-2">
                                                    <Twitter className="h-3 w-3" /> Twitter
                                                </Label>
                                                <Input
                                                    value={formData.twitter}
                                                    onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                                                    placeholder="https://twitter.com/username"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-xs flex items-center gap-2">
                                                    <Instagram className="h-3 w-3" /> Instagram
                                                </Label>
                                                <Input
                                                    value={formData.instagram}
                                                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                                    placeholder="https://instagram.com/username"
                                                />
                                            </div>
                                            <div className="grid gap-1">
                                                <Label className="text-xs flex items-center gap-2">
                                                    <Gamepad2 className="h-3 w-3" /> Discord
                                                </Label>
                                                <Input
                                                    value={formData.discord}
                                                    onChange={e => setFormData({ ...formData, discord: e.target.value })}
                                                    placeholder="username#0000"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid gap-2">
                                            {profile.socialLinks?.twitter && (
                                                <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded transition-colors">
                                                    <div className="bg-blue-500/10 p-2 rounded text-blue-500">
                                                        <Twitter className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">Twitter</span>
                                                </a>
                                            )}
                                            {profile.socialLinks?.instagram && (
                                                <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded transition-colors">
                                                    <div className="bg-pink-500/10 p-2 rounded text-pink-500">
                                                        <Instagram className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">Instagram</span>
                                                </a>
                                            )}
                                            {profile.socialLinks?.discord && (
                                                <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded transition-colors cursor-default">
                                                    <div className="bg-indigo-500/10 p-2 rounded text-indigo-500">
                                                        <Gamepad2 className="h-4 w-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">{profile.socialLinks.discord}</span>
                                                </div>
                                            )}
                                            {!profile.socialLinks?.twitter && !profile.socialLinks?.instagram && !profile.socialLinks?.discord && (
                                                <p className="text-muted-foreground italic">No social links added.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
