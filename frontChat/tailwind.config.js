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
          slate: "#2F4F4F",      // Couleur principale - gris ardoise foncé
          accent: "#D9822B",      // Couleur d'accent - orange/terre
          paper: "#FCFCF7",      // Fond principal - papier crème
          surface: "#FFFFFF",    // Surfaces blanches
          mint: "#BBD5D0",       // Mint vert - pour les accents et hover
          grey: "#E0E0E0",       // Gris clair pour les bordures
        },
        text: {
          primary: "#1C1C1C",    // Texte principal - presque noir
          secondary: "#616161",   // Texte secondaire - gris moyen
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: "0 1px 0 rgba(28,28,28,0.04), 0 4px 12px rgba(28,28,28,0.06)",
      },
      borderRadius: {
        md: '10px',
        lg: '12px',
      },
    },
  },
  plugins: [],
}
