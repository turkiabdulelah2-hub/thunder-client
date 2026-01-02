import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "@/stores/storeStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Upload } from "lucide-react";

export default function CreateItemPage() {
    const navigate = useNavigate();
    const { createItem, loading } = useStoreStore();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        contactInfo: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please upload an image");
            return;
        }

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("contactInfo", formData.contactInfo);
            data.append("image", imageFile);

            await createItem(data);
            toast.success("Item listed successfully!");
            navigate("/store");
        } catch (error: any) {
            toast.error(error.message || "Failed to list item");
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-10 px-4 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#120033] opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container max-w-2xl relative z-10">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => navigate("/store")}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Store
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">List New Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label>Item Image</Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                                                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="e.g. Rare Car, House, etc."
                                        required
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="bg-background/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="bg-background/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Describe your item..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-background/50 min-h-[100px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactInfo">Contact Info (Optional)</Label>
                                    <Input
                                        id="contactInfo"
                                        name="contactInfo"
                                        placeholder="Discord ID, Phone, etc."
                                        value={formData.contactInfo}
                                        onChange={handleChange}
                                        className="bg-background/50"
                                    />
                                </div>

                                <Button type="submit" className="w-full btn-neon" disabled={loading}>
                                    {loading ? "Listing Item..." : "List Item"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
