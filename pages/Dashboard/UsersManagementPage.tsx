import { SEO } from "@/components/SEO/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useUserStore, User } from "@/stores/userStore";
import { getImageUrl } from '@/lib/imageUtils';

export default function UsersManagementPage() {
    const { users, loading, fetchUsers, updateUser, deleteUser, createUser, clearError } = useUserStore();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
        socialLinks: {
            kick: "",
            twitch: "",
            youtube: "",
            tiktok: "",
            discord: "",
            twitter: "",
            instagram: ""
        }
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        setSubmitting(true);
        try {
            if (editingUser) {
                await updateUser(editingUser._id, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role as 'user' | 'admin',
                    isActive: formData.isActive,
                    socialLinks: formData.socialLinks
                });
            } else {
                await createUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role as 'user' | 'admin',
                    isActive: formData.isActive,
                    socialLinks: formData.socialLinks
                });
            }

            setDialogOpen(false);
            resetForm();
        } catch (err) {
            // Error handled by store
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            await deleteUser(id);
        } catch (err) {
            // Error handled by store
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "", // Password not editable directly here
            role: user.role,
            isActive: user.isActive,
            socialLinks: {
                kick: user.socialLinks?.kick || "",
                twitch: user.socialLinks?.twitch || "",
                youtube: user.socialLinks?.youtube || "",
                tiktok: user.socialLinks?.tiktok || "",
                discord: user.socialLinks?.discord || "",
                twitter: user.socialLinks?.twitter || "",
                instagram: user.socialLinks?.instagram || ""
            }
        });
        setDialogOpen(true);
    };

    const handleCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: "user",
            isActive: true,
            socialLinks: {
                kick: "",
                twitch: "",
                youtube: "",
                tiktok: "",
                discord: "",
                twitter: "",
                instagram: ""
            }
        });
        setEditingUser(null);
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <SEO
                title="إدارة المستخدمين"
                description="إدارة المستخدمين في السيرفر"
                noIndex={true}
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Users Management</h1>
                <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                    Add User
                </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="bg-[#200f3f] border-primary/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="bg-[#2a174b] border-primary/20"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="bg-[#2a174b] border-primary/20"
                            />
                        </div>
                        {!editingUser && (
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="bg-[#2a174b] border-primary/20"
                                />
                            </div>
                        )}

                        {/* Social Links Section */}
                        <div className="space-y-2 border-t border-primary/20 pt-4">
                            <h3 className="font-semibold">Streaming & Social Links</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="kick">Kick</Label>
                                    <Input
                                        id="kick"
                                        value={formData.socialLinks.kick}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, kick: e.target.value } })}
                                        className="bg-[#2a174b] border-primary/20"
                                        placeholder="Kick URL"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="twitch">Twitch</Label>
                                    <Input
                                        id="twitch"
                                        value={formData.socialLinks.twitch}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, twitch: e.target.value } })}
                                        className="bg-[#2a174b] border-primary/20"
                                        placeholder="Twitch URL"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="youtube">YouTube</Label>
                                    <Input
                                        id="youtube"
                                        value={formData.socialLinks.youtube}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, youtube: e.target.value } })}
                                        className="bg-[#2a174b] border-primary/20"
                                        placeholder="YouTube URL"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tiktok">TikTok</Label>
                                    <Input
                                        id="tiktok"
                                        value={formData.socialLinks.tiktok}
                                        onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, tiktok: e.target.value } })}
                                        className="bg-[#2a174b] border-primary/20"
                                        placeholder="TikTok URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between" style={{ direction: "rtl" }}>
                            <Label htmlFor="isActive">Active</Label>
                            <Switch
                                id="isActive"
                                style={{ direction: "ltr" }}
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={submitting}>
                            {editingUser ? "Update User" : "Create User"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user, index) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="bg-[#200f3f] border-primary/20 hover:border-primary/50 transition-all">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-12 h-12 shrink-0">
                                        {user.avatar ? (
                                            <img
                                                src={getImageUrl(user.avatar)}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover border-2 border-primary"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full border-2 border-primary bg-gray-700 flex items-center justify-center">
                                                <span className="text-white/50 text-xs">No Img</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold text-white truncate">{user.name}</h3>
                                        <p className="text-xs text-white/50 truncate" title={user.email}>{user.email}</p>
                                        <p className="text-[10px] text-primary/70 truncate">@{user.slug}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {user.socialLinks?.kick && <span className="text-xs bg-green-900 text-green-100 px-2 py-1 rounded">Kick</span>}
                                    {user.socialLinks?.twitch && <span className="text-xs bg-purple-900 text-purple-100 px-2 py-1 rounded">Twitch</span>}
                                    {user.socialLinks?.youtube && <span className="text-xs bg-red-900 text-red-100 px-2 py-1 rounded">YouTube</span>}
                                </div>

                                <div className={`text-xs text-center mb-3 ${user.isActive ? "text-green-500" : "text-red-500"}`}>
                                    {user.isActive ? "Active" : "Inactive"}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(user)}
                                        className="flex-1 text-blue-500 hover:bg-blue-500/20"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(user._id)}
                                        className="flex-1 text-red-500 hover:bg-red-500/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
