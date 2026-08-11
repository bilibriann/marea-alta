// globals.css es CSS plano (sin Tailwind) — este archivo existe sobre todo
// para que la resolución de config de PostCSS se detenga acá y no siga
// subiendo hasta encontrar ../postcss.config.mjs (que pide @tailwindcss/postcss,
// un paquete que no está instalado en admin/node_modules).
const config = {
  plugins: {},
}

export default config
