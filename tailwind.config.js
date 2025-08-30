/** @type {import('tailwindcss').Config} */

import lineClamp from '@tailwindcss/line-clamp';

export default {
  content: ["./src/**/*.{html,js,jsx}"],
  plugins: [
    lineClamp,
  ],
  theme: {
    extend: {
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
}
