import { createClient } from 'contentful';
import type { SiteContent, NavLink } from '@/types';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const fallbackContent: SiteContent = {
  appName: 'Dalmatia Stays',
  heroTitle: 'Find Your Perfect Getaway',
  heroSubtitle: 'Discover amazing accommodations in beautiful Dalmatia',
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Explore', href: '/accommodations' },
    { label: 'About', href: '/about' },
  ],
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
      return fallbackContent;
    }

    const response = await client.getEntries({
      content_type: 'siteSettings',
      limit: 1,
    });

    if (response.items.length === 0) {
      return fallbackContent;
    }

    const entry = response.items[0].fields as {
      appName?: string;
      heroTitle?: string;
      heroSubtitle?: string;
      navLinks?: Array<{ fields: { label: string; href: string } }>;
    };

    return {
      appName: (entry.appName as string) || fallbackContent.appName,
      heroTitle: (entry.heroTitle as string) || fallbackContent.heroTitle,
      heroSubtitle: (entry.heroSubtitle as string) || fallbackContent.heroSubtitle,
      navLinks: entry.navLinks
        ? entry.navLinks.map((link) => ({
            label: link.fields.label,
            href: link.fields.href,
          }))
        : fallbackContent.navLinks,
    };
  } catch (error) {
    console.error('Error fetching Contentful content:', error);
    return fallbackContent;
  }
}

export async function getNavLinks(): Promise<NavLink[]> {
  const content = await getSiteContent();
  return content.navLinks;
}

export async function getAppName(): Promise<string> {
  const content = await getSiteContent();
  return content.appName;
}
