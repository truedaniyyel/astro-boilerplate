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
