import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        snapdesk: {
          primary: '#a9bcb7',
          secondary: '#e590A1',
          'primary-dark': '#8fa8a1',
          'secondary-dark': '#d17a8a',
        }
      }
    },
  },
  plugins: [],
}

export default config
