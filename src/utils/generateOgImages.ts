import sharp from "sharp";
import siteOgImage from "./og-templates/site";

function svgBufferToPngBuffer(svg: string) {
  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

export async function generateOgImageForSite() {
  const svg = await siteOgImage();
  return svgBufferToPngBuffer(svg);
}
