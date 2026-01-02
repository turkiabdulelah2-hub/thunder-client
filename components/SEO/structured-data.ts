export type StructuredData =
    | {
        "@context": "https://schema.org";
        "@type": "WebSite";
        name: string;
        url: string;
        potentialAction?: {
            "@type": "SearchAction";
            target: {
                "@type": "EntryPoint";
                urlTemplate: string;
            };
            "query-input": string;
        };
    }
    | {
        "@context": "https://schema.org";
        "@type": "Organization";
        name: string;
        url: string;
        logo?: string;
        sameAs?: string[];
    }
    | {
        "@context": "https://schema.org";
        "@type": "BreadcrumbList";
        itemListElement: {
            "@type": "ListItem";
            position: number;
            name: string;
            item: string;
        }[];
    };

export const generateWebSiteSchema = (
    name: string,
    url: string,
    searchUrl?: string
): StructuredData => {
    const schema: StructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url,
    };

    if (searchUrl) {
        schema.potentialAction = {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${searchUrl}?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        };
    }

    return schema;
};

export const generateOrganizationSchema = (
    name: string,
    url: string,
    logo?: string,
    socialLinks?: string[]
): StructuredData => {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url,
        logo,
        sameAs: socialLinks,
    };
};

export const generateBreadcrumbSchema = (
    items: { name: string; url: string }[]
): StructuredData => {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
};
