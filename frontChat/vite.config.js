import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@services": path.resolve(__dirname, "./src/services"),   // <== ajouté
      "@hooks": path.resolve(__dirname, "./src/hooks"),         // <== ajouté
      "@utils": path.resolve(__dirname, "./src/utils")

    }
  }
});
