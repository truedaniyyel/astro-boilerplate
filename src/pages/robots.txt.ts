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
