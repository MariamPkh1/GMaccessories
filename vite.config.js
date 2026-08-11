import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// Tailwind is wired in here rather than left to postcss.config.js discovery.
// That discovery is relative to the process working directory, so running the
// build from a parent folder (a monorepo-style `npm --prefix`, or a CI job with
// a different root) silently produced a stylesheet with no utilities in it --
// the page rendered completely unstyled with no error anywhere. Resolving the
// config against this file's own URL makes it independent of where it's run.
const tailwindConfig = fileURLToPath(new URL('./tailwind.config.js', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss({ config: tailwindConfig }), autoprefixer()],
    },
  },
})
