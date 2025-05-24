import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructMetadata({
  title = "Sitemint - The Modern Website Refreshed",
  description = "Build and resell SEO-optimised Next.js sites with Sitemint — an open-source, AI-driven CMS",
  image = "/opengraph-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const siteUrl = "https://www.sitemint.tech";
  const siteName = "Sitemint";
  const twitterHandle = "@sitemint";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Sitemint - Website builder",
        },
      ],
      locale: "en_IE",
      type: "website",
      siteName: siteName,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: twitterHandle,
      site: twitterHandle,
    },
    icons: {
      icon: icons,
      shortcut: icons,
      apple: icons,
    },
    metadataBase: new URL(siteUrl),
    authors: [{ name: siteName, url: siteUrl }],
    keywords: [
      "Sitemint",
      "website builder",
      "website management",
      "website design",
      "website development",
      "website hosting",
      "website maintenance",
      "website marketing",
      "website analytics",
    ],
    category: "Website builder",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
