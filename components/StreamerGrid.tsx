import { Loader2 } from "lucide-react";
import StreamerCard from "./StreamerCard";
import { User } from "@/stores/userStore";

interface StreamerGridProps {
    streamers: User[];
    loading: boolean;
    error: string | null;
    maxItems?: number;
    columns?: {
        sm: number;
        md: number;
        lg: number;
    };
    cardSize?: "sm" | "md" | "lg";
}

export default function StreamerGrid({
    streamers,
    loading,
    error,
    maxItems,
    columns = { sm: 3, md: 4, lg: 5 },
    cardSize = "md"
}: StreamerGridProps) {
    const displayStreamers = maxItems ? streamers.slice(0, maxItems) : streamers;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <span className="ml-3 text-white/70">جاري التحميل...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 text-xl">{error}</p>
            </div>
        );
    }

    if (displayStreamers.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-white/70 text-xl">لا يوجد صناع محتوى حالياً</p>
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-2 sm:grid-cols-${columns.sm} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-4 md:gap-6 max-w-7xl mx-auto`}>
            {displayStreamers.map((streamer, index) => (
                <StreamerCard
                    key={streamer._id}
                    streamer={streamer}
                    index={index}
                    size={cardSize}
                />
            ))}
        </div>
    );
}
