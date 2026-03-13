/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        electricBlue: '#0A84FF',
        cyberPurple: '#BF5AF2',
        neonCyan: '#5AC8FA',
        darkBg: '#050505',
        glass: 'rgba(255, 255, 255, 0.05)',
        bgPrimary: 'var(--bg-primary)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        iconColor: 'var(--icon-color)',
        cardBg: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #0A84FF' },
          '100%': { boxShadow: '0 0 20px #5AC8FA, 0 0 30px #0A84FF' }
        }
      }
    },
  },
  plugins: [],
}
