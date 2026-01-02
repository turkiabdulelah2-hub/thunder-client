import { SEO } from "@/components/SEO/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useSystemSettingsStore } from "@/stores/systemSettingsStore";
import { toast } from "sonner";

export default function SystemSettingsPage() {
    const { settings, loading, error, fetchSettings, updateSettings, clearError } = useSystemSettingsStore();
    const [formData, setFormData] = useState({
        currentStreamLink: "",
        siteName: "",
        maintenanceMode: false,
        welcomeMessage: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    useEffect(() => {
        if (settings) {
            setFormData({
                currentStreamLink: settings.currentStreamLink || "",
                siteName: settings.siteName || "",
                maintenanceMode: settings.maintenanceMode || false,
                welcomeMessage: settings.welcomeMessage || ""
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setSaving(true);

        try {
            await updateSettings(formData);
            toast.success("Settings updated successfully!");
        } catch (err) {
            toast.error(error || "Failed to update settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !settings) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <SEO
                title="إعدادات النظام"
                description="إعدادات النظام"
                noIndex={true}
            />
            <div className="flex items-center gap-3 mb-8">
                <Settings className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-white">System Settings</h1>
            </div>

            <Card className="bg-[#200f3f] border-primary/20">
                <CardHeader>
                    <CardTitle className="text-white">Application Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="hidden">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                value={formData.siteName}
                                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                className="bg-[#2a174b] border-primary/20 text-white"
                                placeholder="Respect Community"
                            />
                        </div>

                        <div >
                            <Label htmlFor="currentStreamLink">Current Stream Link</Label>
                            <Input
                                id="currentStreamLink"
                                type="url"
                                value={formData.currentStreamLink}
                                onChange={(e) => setFormData({ ...formData, currentStreamLink: e.target.value })}
                                className="bg-[#2a174b] border-primary/20 text-white"
                                placeholder="https://kick.com/streamer"
                            />
                            <p className="text-xs text-white/50 mt-1">
                                The main stream link displayed on the homepage
                            </p>
                        </div>

                        <div className="hidden">
                            <Label htmlFor="welcomeMessage">Welcome Message</Label>
                            <Textarea
                                id="welcomeMessage"
                                value={formData.welcomeMessage}
                                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                className="bg-[#2a174b] border-primary/20 text-white min-h-[100px]"
                                placeholder="Welcome to our community!"
                            />
                        </div>

                        <div className="flex hidden items-center justify-between p-4 bg-[#2a174b] rounded-lg">
                            <div>
                                <Label htmlFor="maintenanceMode" className="text-base">Maintenance Mode</Label>
                                <p className="text-xs text-white/50 mt-1">
                                    Enable to show maintenance page to visitors
                                </p>
                            </div>
                            <Switch
                                id="maintenanceMode"
                                checked={formData.maintenanceMode}
                                onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="ml-2 h-4 w-4" />
                                    Save Settings
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {settings && (
                <Card className="bg-[#200f3f] border-primary/20 mt-6">
                    <CardHeader>
                        <CardTitle className="text-white text-sm">System Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-white/50 space-y-1">
                        <p>Last Updated: {new Date(settings.updatedAt).toLocaleString()}</p>
                        <p>Created: {new Date(settings.createdAt).toLocaleString()}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
