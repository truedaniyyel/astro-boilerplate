import sharp from "sharp";
import siteOgImage from "./og-templates/site";

// Use JPEG for maximum browser support. You can switch to WebP for smaller file sizes, but ensure social media platforms support it.
function svgBufferToPngBuffer(svg: string) {
  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
