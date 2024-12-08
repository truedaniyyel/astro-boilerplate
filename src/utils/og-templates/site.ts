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
