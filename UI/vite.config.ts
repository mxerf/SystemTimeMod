import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  build: {
    outDir: '../dist/ui',
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        entryFileNames: "system-time-mod.js",
        assetFileNames: "system-time-mod.[ext]"
      }
    }
  },
  base: 'coui://system-time-mod/'
})
