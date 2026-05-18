import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import prerender from "vite-plugin-prerender";

import { contentManifestPlugin } from "./vite-plugin-content-manifest";
import { sitemapPlugin } from "./vite-plugin-sitemap";

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),

    // Generates article manifest
    contentManifestPlugin(),

    // Generates sitemap.xml
    sitemapPlugin(),

    // PRE-RENDER important routes for SEO
    prerender({
      routes: [
        "/",
        "/docs",
        "/practice",
        "/mindmap",
        "/about",
      ],
      // Optional: ensures head/meta updates finish before snapshot
      renderAfterTime: 500,
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },

  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
