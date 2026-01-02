import { SEO } from "@/components/SEO/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import StreamerGrid from "@/components/StreamerGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StreamersPage() {
    const { streamers, loading, error, fetchStreamers, streamersPagination } = useUserStore();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchStreamers(page, 15, search);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search]);

    return (
        <>
            <SEO
                title="صناع المحتوى"
                description="تعرف على نخبة صناع المحتوى في مجتمع ريسبكت. تابع بثوثهم المباشرة واستمتع بأفضل لحظات الرول بلاي."
                keywords={["ستريمرز", "بث مباشر", "تويتش", "يوتيوب", "ريسبكت", "صناع المحتوى"]}
                url="/streamers"
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "الرئيسية",
                            item: "https://respect-cfw.com"
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "صناع المحتوى",
                            item: "https://respect-cfw.com/streamers"
                        }
                    ]
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: 'url(/images/bg-4.png)' }}
                >
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="container relative z-20 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            صناع المحتوى
                        </h1>

                        <Breadcrumb className="mb-6 flex justify-center">
                            <BreadcrumbList className="text-white/90">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/" className="text-white/70 hover:text-white text-lg">
                                        الرئيسية
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator>
                                    <ChevronLeft className="text-white/70" />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white text-lg font-semibold">
                                        صناع المحتوى
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </motion.div>
                </div>
            </section>

            {/* Streamers Grid Section */}
            <section className="py-20 bg-[#120033]">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white text-center md:text-left">
                            جميع صناع المحتوى
                        </h2>

                        <div className="relative w-full md:w-auto">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="ابحث عن صانع محتوى..."
                                className="w-full md:w-[300px] pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-primary/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <StreamerGrid
                        streamers={streamers}
                        loading={loading}
                        error={error}
                        columns={{ sm: 3, md: 4, lg: 5 }}
                        cardSize="lg"
                    />

                    {streamersPagination?.pages > 1 && (
                        <div className="mt-12 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-2 px-4 text-white/70 font-mono">
                                Page {page} of {streamersPagination?.pages || 1}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.min(streamersPagination?.pages || 1, p + 1))}
                                disabled={page === (streamersPagination?.pages || 1) || loading}
                                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
