import { SEO } from "@/components/SEO/SEO";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRuleStore } from "@/stores/ruleStore";
import { toast } from "sonner";

export default function RulesManagementPage() {
    const { rules, loading, error, fetchRules, createRule, updateRule, deleteRule, clearError } = useRuleStore();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        order: 0,
        isActive: true
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch rules on mount only if not already loaded
    useEffect(() => {
        if (rules.length === 0 && !loading) {
            console.log("[Rules] Fetching rules...");
            fetchRules();
        }
    }, [fetchRules, rules.length, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSubmitting(true);

        try {
            if (editingRule) {
                await updateRule(editingRule._id, formData);
                toast.success("Rule updated successfully!");
            } else {
                await createRule(formData);
                toast.success("Rule created successfully!");
            }

            setDialogOpen(false);
            resetForm();
            // Refresh rules after update
            await fetchRules();
        } catch (err) {
            toast.error(error || "Failed to save rule");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        try {
            await deleteRule(id);
            toast.success("Rule deleted successfully!");
            // Refresh rules after delete
            await fetchRules();
        } catch (err) {
            toast.error(error || "Failed to delete rule");
        }
    };

    const handleEdit = (rule: any) => {
        setEditingRule(rule);
        setFormData({
            title: rule.title,
            description: rule.description,
            order: rule.order,
            isActive: rule.isActive
        });
        setDialogOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            order: 0,
            isActive: true
        });
        setEditingRule(null);
    };

    if (loading && rules.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="ml-3 text-white/70">Loading rules...</p>
            </div>
        );
    }

    return (
        <div>
            <SEO
                title="إدارة القوانين"
                description="إدارة قوانين السيرفر"
                noIndex={true}
            />
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Rules Management</h1>
                    <p className="text-white/60 mt-2">Manage community rules and guidelines</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="ml-2 h-5 w-5" />
                            Add Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#200f3f] border-primary/20 text-white max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingRule ? "Edit Rule" : "Add New Rule"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="bg-[#2a174b] border-primary/20"
                                    placeholder="Rule title"
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={5}
                                    className="bg-[#2a174b] border-primary/20"
                                    placeholder="Rule description"
                                />
                            </div>
                            <div>
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="bg-[#2a174b] border-primary/20"
                                    placeholder="Display order (0 = first)"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="isActive">Active</Label>
                                <Switch
                                    id="isActive"
                                    style={{ direction: "ltr" }}
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        {editingRule ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    editingRule ? "Update Rule" : "Create Rule"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-500">{error}</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearError}
                        className="mt-2 text-red-400 hover:text-red-300"
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {loading && rules.length > 0 && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-white/70 text-sm">Refreshing rules...</p>
                </div>
            )}

            {rules.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-white/70 text-xl">No rules found. Create your first rule!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {rules.map((rule, index) => (
                        <motion.div
                            key={rule._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-[#200f3f] border-primary/20 hover:border-primary/50 transition-all">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-white/50 text-sm">#{rule.order}</span>
                                                <CardTitle className="text-white">{rule.title}</CardTitle>
                                            </div>
                                            <p className="text-white/70 mt-2 leading-relaxed">{rule.description}</p>
                                            <div className="flex gap-4 mt-3">
                                                <span className={`text-sm px-3 py-1 rounded-full ${rule.isActive
                                                    ? "bg-green-500/20 text-green-500"
                                                    : "bg-red-500/20 text-red-500"
                                                    }`}>
                                                    {rule.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleEdit(rule)}
                                                className="text-blue-500 hover:bg-blue-500/20"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDelete(rule._id)}
                                                className="text-red-500 hover:bg-red-500/20"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
