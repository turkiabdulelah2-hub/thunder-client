import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getImageUrl } from '@/lib/imageUtils';
import { Link } from "react-router-dom";
import { User } from "@/stores/userStore";

interface StreamerCardProps {
    streamer: User;
    index: number;
    size?: "sm" | "md" | "lg";
}

export default function StreamerCard({ streamer, index, size = "md" }: StreamerCardProps) {
    const sizeClasses = {
        sm: "max-w-[100px]",
        md: "max-w-[120px]",
        lg: "max-w-[140px]"
    };

    const textSizes = {
        sm: "text-base md:text-lg",
        md: "text-xl md:text-2xl",
        lg: "text-2xl md:text-3xl"
    };

    const AvatarContent = (
        <div className="relative w-full h-full rounded-full border-4 border-primary p-2 group-hover:border-primary/80 transition-colors bg-background">
            <img
                src={getImageUrl(streamer.avatar)}
                alt={streamer.name}
                className="w-full h-full rounded-full object-cover"
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(streamer.name)}&background=8B5CF6&color=fff&size=150`;
                }}
            />
        </div>
    );

    // Determine platforms to show
    const platforms = [];
    if (streamer.socialLinks?.kick) platforms.push('Kick');
    if (streamer.socialLinks?.twitch) platforms.push('Twitch');
    if (streamer.socialLinks?.youtube) platforms.push('YouTube');
    const platformText = platforms.length > 0 ? platforms.join(', ') : 'Streamer';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.05, 0.5) }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="block"
        >
            <Card className="bg-[#200f3f] backdrop-blur-sm hover:border-primary/60 border-0 transition-all duration-300 group overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center">
                    <div className={`relative mb-4 w-full aspect-square ${sizeClasses[size]} mx-auto z-20`}>
                        <Link to={`/profile/${streamer._id}`} className="block w-full h-full cursor-pointer">
                            {AvatarContent}
                        </Link>
                    </div>

                    <Link
                        to={`/profile/${streamer._id}`}
                        className="flex flex-col items-center w-full z-10"
                    >
                        <h3 className={`${textSizes[size]} font-bold text-white group-hover:text-primary transition-colors text-center line-clamp-1`}>
                            {streamer.name}
                        </h3>
                        <span className="text-xs text-white/50 mt-1 capitalize">
                            {platformText}
                        </span>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
}
