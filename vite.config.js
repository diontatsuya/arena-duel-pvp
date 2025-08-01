import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "./", // ganti dari "/" ke "./" agar tidak blank saat deploy
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/_redirects",
          dest: ".", // tetap benar
        },
      ],
    }),
  ],
});
