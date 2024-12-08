// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { SITE } from "./src/config";

// https://astro.build/config
export default defineConfig({
  site: SITE.canonicalURL,
  integrations: [tailwind(), sitemap()],
});
