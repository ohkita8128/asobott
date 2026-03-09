import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://asobott.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/lp', '/terms', '/privacy'],
        disallow: ['/api/', '/liff/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
