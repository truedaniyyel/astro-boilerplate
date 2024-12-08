import type socialIcons from "@assets/socialIcons";

export type Site = {
  canonicalURL: string; // Canonical URL
  lang: string;
  author?: string;
  name: string; // Site name
  title: string; // Default title for meta tags
  description: string; // Default description for meta tags
  image: string; // Default image for meta tags
  imageAlt: string; // Alt text for the image

  og?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };

  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player"; // Twitter Card type
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
    creator?: string; // Twitter handle of the creator
  };
};

export type Socials = {
  name: keyof typeof socialIcons;
  href: string;
  linkTitle: string;
  active: boolean;
}[];
