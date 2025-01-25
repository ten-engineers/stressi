import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/stressi",
  build: {
    outDir: "dist", // Папка для сборки, обычно это 'dist'
  },
});
