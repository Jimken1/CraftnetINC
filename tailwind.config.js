module.exports = {
  content: [
    './**/*.html',
    './**/*.js',
    '!./node_modules/**',
    '!./dist/**'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EC',
        ink: '#16151F',
        navy: '#2A2740',
        chip: {
          mint: '#DCF2E3',
          peach: '#FBE2CE',
          lavender: '#E8E3F9',
          pink: '#FCE1E8'
        },
        section: {
          lavender: '#EDEAFB'
        },
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 55px rgba(17, 24, 39, 0.12)',
        card: '0 12px 30px rgba(22, 21, 31, 0.08)'
      },
      borderRadius: {
        panel: '1rem',
        soft: '1.5rem'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      transitionTimingFunction: {
        'ease-out-craft': 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
};
