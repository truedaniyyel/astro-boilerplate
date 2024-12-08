## Project Setup: Astro, Tailwind CSS, TypeScript, ESLint, Prettier, pnpm

## Dynamic OG Image Generation with Satori and Sharp.

## Project Structure

/
├── public/
│ ├── fonts/
│ └── js/
├── src/
│ ├── assets/
│ │ ├── images/
│ │ └── socialIcons.ts
│ ├── components/
│ │ └── Images.astro
│ ├── layouts/
│ │ └── Layout.astro
│ ├── pages/
│ │ ├── 403.astro
│ │ ├── 404.astro
│ │ ├── 500.astro
│ │ ├── index.astro
│ │ ├── og.png.ts
│ │ └── robots.txt.ts
│ ├── styles/
│ │ └── base.css
│ ├── utils/
│ │ ├── og-templates/
│ │ │ └── site.ts
│ │ ├── generateOgImages.ts
│ │ └── loadGoogleFont.ts
│ ├── config.ts
│ ├── env.d.ts
│ └── types.ts
├── .gitignore
├── .prettierignore
├── .prettierrc.mjs
├── README.md
├── astro.config.mjs
├── eslint.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.mjs
└── tsconfig.json

## Configuration

Site configuration, including the canonical URL, website name, title, description, etc., is stored in the config.ts file. For more details on the fields and how to define new ones, see types.ts.

config.ts

```ts
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
```

types.ts

```ts
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
```

## Dynamic OG Image Generation

Dynamic OG Image generation is handled with Satori and Sharp.

### Templates for OG Images

The templates for OG images are defined in the src/utils/og-templates folder. For the entire site, the template is in site.ts. If you need a specific template for a blog, you can create a new file, e.g., blog.ts.

og-templates/site.ts

```ts
import { SITE } from "@config";
import satori from "satori";
import type { FontConfig } from "../loadGoogleFont";
import { loadGoogleFont } from "../loadGoogleFont";

const fontsConfig: FontConfig[] = [
  {
    name: "Roboto",
    font: "Roboto",
    weight: 400,
  },
  {
    name: "Roboto",
    font: "Roboto:wght@700",
    weight: 700,
  },
];

export default async () => {
  return satori(
    {
      type: "div",
      props: {
        children: "hello, world",
        style: { color: "black" },
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadGoogleFont(
        SITE.title + SITE.description + SITE.canonicalURL,
        fontsConfig
      ),
    }
  );
};
```

generateOgImage.ts

```ts
import sharp from "sharp";
import siteOgImage from "./og-templates/site";

// Use JPEG for maximum browser support. You can switch to WebP for smaller file sizes, but ensure social media platforms support it. And don't forget to change JPEG to WebP in pages/og.png.ts.
function svgBufferToPngBuffer(svg: string) {
  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
```

loadGoogleFonts.ts: We need to dynamically load fonts for Satori.

```ts
import type { FontStyle, FontWeight } from "satori";

export type FontOptions = {
  data: ArrayBuffer;
  name: string;
  weight: FontWeight;
  style?: FontStyle;
  lang?: string;
};

export type FontConfig = Omit<FontOptions, "data"> & {
  font: string;
};

async function fetchFont(font: string, text: string): Promise<ArrayBuffer> {
  const API = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;

  const css = await fetch(API, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
    },
  }).then(response => response.text());

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (!resource)
    throw new Error(
      `Failed to extract font URL from Google Fonts API response for font: ${font}`
    );

  const response = await fetch(resource[1]);

  if (!response.ok) {
    throw new Error(
      `Failed to download font from ${resource[1]}. Status: ${response.status}`
    );
  }

  const fonts = await response.arrayBuffer();

  return fonts;
}

export async function loadGoogleFont(
  text: string,
  fontsConfig: FontConfig[]
): Promise<FontOptions[]> {
  const fonts = await Promise.all(
    fontsConfig.map(async ({ name, font, weight, style }) => {
      const data = await fetchFont(font, text);
      return { name, data, weight, style };
    })
  );

  return fonts;
}
```

pages/og.png.ts to generate image

```ts
import { generateOgImageForSite } from "@utils/generateOgImages";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () =>
  new Response(await generateOgImageForSite(), {
    headers: { "Content-Type": "image/jpeg" },
  });
```

## Robots.txt and Sitemap

Astro automatically handles sitemap generation. Just make sure to specify the canonicalURL in src/config.ts.

For robots.txt, the src/pages/robots.txt.ts file generates it dynamically at build time (this refers to generation at the time of build, not "dynamically" in real-time, like idk why they never specify it).

src/pages/robots.txt.ts

```ts
import { SITE } from "@config";
import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = () => {
  const sitemapURL = new URL("sitemap-index.xml", SITE.canonicalURL);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { "Content-Type": "text/plain" },
  });
};
```

## SEO and Meta Tags

The SEO-related meta tags (Open Graph, Twitter Card, and JSON-LD schema data) are defined in the src/layouts/Layout.astro file.

src/layouts/Layout.astro

```ts
---
// Your SEO and Google Site Verification details go here.
import { SITE } from "@config";
import "@styles/base.css";

const googleSiteVerification = import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION;
const socialImageURL = new URL(SITE.image, Astro.url.origin).href;

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: SITE.title,
  url: SITE.canonicalURL,
  description: SITE.description,
  isPartOf: {
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.canonicalURL,
  },
};
---
<!doctype html>
<html lang={SITE.lang ?? "en"}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="canonical" href={SITE.canonicalURL} />
    <meta name="generator" content={Astro.generator} />

    <!-- General Meta Tags -->
    <title>{SITE.title}</title>
    <meta name="description" content={SITE.description} />

    <!-- Open Graph / Facebook -->
    <meta property="og:title" content={SITE.title} />
    <meta property="og:description" content={SITE.description} />
    <meta property="og:url" content={SITE.canonicalURL} />
    <meta property="og:image" content={socialImageURL} />

    <!-- Twitter -->
    <meta property="twitter:card" content={SITE.twitter?.card} />
    <meta property="twitter:title" content={SITE.title} />
    <meta property="twitter:description" content={SITE.description} />
    <meta property="twitter:image" content={socialImageURL} />

    <!-- Google JSON-LD Structured data -->
    <script type="application/ld+json" set:html={JSON.stringify(schemaData)} />

    <!-- Font -->
    <link
      href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
      rel="stylesheet"
    />

    {googleSiteVerification && (
      <meta name="google-site-verification" content={googleSiteVerification} />
    )}
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Components

The Images.astro component is used to import and display images dynamically without having to import each image manually in index.astro.
