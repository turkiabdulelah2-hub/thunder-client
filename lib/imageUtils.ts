import { API_BASE_URL } from './axios';

export function getImageUrl(src?: string): string {
    // Handle invalid cases
    if (!src || src === 'undefined' || src === 'null' || src.trim() === '') {
        console.debug('[IMAGE] Invalid source:', src);
        return '/placeholder.png';
    }

    // External URL (already complete)
    if (src.startsWith("http://") || src.startsWith("https://")) {
        return src;
    }

    // Remove any leading slashes and normalize path
    const cleanPath = src.replace(/^\/+/, '').replace(/\\/g, '/');

    // Construct full URL - ensure proper encoding
    // API_BASE_URL usually includes /api, so we need to strip it for static uploads
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
    const finalUrl = `${baseUrl}/uploads/${cleanPath}`;

    console.log('[IMAGE] Constructed URL:', { src, cleanPath, finalUrl });

    return finalUrl;
}

export async function validateImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image();
        const timeout = setTimeout(() => {
            img.src = '';
            resolve(false);
        }, 5000); // 5 second timeout

        img.onload = () => {
            clearTimeout(timeout);
            resolve(true);
        };

        img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };

        img.src = url;
    });
}

// Debug helper
export function debugImagePath(streamerName: string, imagePath: string) {
    const url = getImageUrl(imagePath);
    console.log('[IMAGE DEBUG]', {
        streamer: streamerName,
        originalPath: imagePath,
        constructedUrl: url,
        apiBase: API_BASE_URL
    });
    return url;
}
