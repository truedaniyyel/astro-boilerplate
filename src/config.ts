import type { Site, Socials } from "./types";

export const SITE: Site = {
  canonicalURL: "http://localhost",
  lang: "en",
  author: "Daniel Adrian",
  name: "",
  title: "",
  description: "",
  image: "/default-og-image.jpg",
  imageAlt: "",

  twitter: {
    card: "summary_large_image",
    image: "-og.jpg",
  },
};

export const SOCIALS: Socials = [
  {
    name: "Github",
    href: "https://github.com/truedaniyyel/astro-landing-example",
    linkTitle: `${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/truedaniyyel",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/truedaniyyel",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
];
