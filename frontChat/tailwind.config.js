/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          paper: "#F8F9FA",   // pour bg-brand-paper
          accent: "#4F8A8B",
          slate: "#2F4F4F",
          mint: "#BBE5C2",
          grey: "#D3D3D3",
        },
        text: {
          primary: "#1A1A1A",
        },
      },
      boxShadow: {
        card: "0 4px 10px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
}
