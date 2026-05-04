import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // 'base' is typically '/' for standard frontend deployments
  base: "/", 
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Simplifies imports: use '@/' to point to your src folder
      "@": path.resolve(__dirname, "./src"),
      // Adjusted assets path to stay within the frontend project structure
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    // Allows access from your local network
    host: true, 
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});