module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true, // Esto ayuda con la especificidad
  corePlugins: {
    preflight: false, // Evita reset de estilos
  },
  theme: {
    extend: {},
  },
}