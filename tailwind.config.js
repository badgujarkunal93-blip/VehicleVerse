/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#06080c',
          900: '#0b0f17',
          850: '#101622',
          800: '#161e2e',
          700: '#222f46',
          600: '#334462',
        },
        cyan: {
          DEFAULT: '#00f2fe',
          glow: 'rgba(0, 242, 254, 0.35)',
        },
        fuel: {
          DEFAULT: '#ff8a00',
          glow: 'rgba(255, 138, 0, 0.35)',
        },
        battery: {
          DEFAULT: '#10b981',
          glow: 'rgba(16, 185, 129, 0.35)',
        },
        inheritance: {
          DEFAULT: '#a855f7',
          glow: 'rgba(168, 85, 247, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'gridScroll 20s linear infinite',
      },
      keyframes: {
        gridScroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        }
      }
    },
  },
  plugins: [],
}
