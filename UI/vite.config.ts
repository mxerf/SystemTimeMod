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
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'system-time-mod.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'system-time-mod.css'
          return 'system-time-mod.[ext]'
        },
      },
    },
  },
})
