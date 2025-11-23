import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  important: '#system-time-mod-root',
  theme: {
    extend: {},
  },
} satisfies Config
