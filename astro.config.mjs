// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

const isRender = process.env.RENDER === "true";

// https://astro.build/config
export default defineConfig({
  site: isRender
    ? process.env.RENDER_EXTERNAL_URL || "https://prasanna-portfolio.onrender.com"
    : "https://prasanna-m2.github.io",
  base: isRender ? "/" : "/PORTFOLIO",
  integrations: [tailwind(), react()],
  vite: {
    resolve: {
      alias: {
        "@": "/src",
        "@components": "/src/components",
      },
    },
  },
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  server: {
    host: true,
    port: 4321,
  },
});
