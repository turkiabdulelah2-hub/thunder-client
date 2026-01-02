import { Helmet } from "react-helmet-async";
import { StructuredData } from "./structured-data";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: "website" | "article" | "profile";
    siteName?: string;
    twitterCard?: "summary" | "summary_large_image";
    structuredData?: StructuredData | StructuredData[];
    noIndex?: boolean;
}

const DEFAULT_TITLE = "Respect CFW | ريسبكت";
const DEFAULT_DESCRIPTION =
    "مجتمع ريسبكت - منصة الألعاب العربية الرائدة. انضم إلينا الآن واستمتع بأفضل تجربة لعب.";
const DEFAULT_SITE_NAME = "Respect CFW";
const DEFAULT_URL = "https://respect-cfw.com"; // Replace with actual domain
const DEFAULT_IMAGE = "/og-image.jpg"; // Ensure this exists in public folder

export const SEO = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = [],
    image = DEFAULT_IMAGE,
    url = DEFAULT_URL,
    type = "website",
    siteName = DEFAULT_SITE_NAME,
    twitterCard = "summary_large_image",
    structuredData,
    noIndex = false,
}: SEOProps) => {
    const fullTitle = title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_TITLE;
    const fullUrl = url.startsWith("http") ? url : `${DEFAULT_URL}${url}`;
    const fullImage = image.startsWith("http") ? image : `${DEFAULT_URL}${image}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
            <link rel="canonical" href={fullUrl} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content="ar_SA" />

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:url" content={fullUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};
