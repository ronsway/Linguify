import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#58CC02',
          dark: '#46A302',
          light: '#D7FFB8',
        },
        blue: {
          DEFAULT: '#1CB0F6',
          dark: '#0A90D3',
          light: '#DDF4FF',
        },
        red: {
          DEFAULT: '#FF4B4B',
          light: '#FFE0E0',
        },
        gold: {
          DEFAULT: '#FFC800',
          dark: '#E0A800',
          light: '#FFF5CC',
        },
        purple: {
          DEFAULT: '#CE82FF',
          dark: '#A855F7',
        },
        orange: '#FF9600',
        gray: {
          bg: '#F7F7F7',
          card: '#FFFFFF',
          border: '#E5E5E5',
          text: '#3C3C3C',
          'text-s': '#777777',
        },
      },
      boxShadow: {
        'duolingo': '0 4px 0',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 1s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(20deg)' },
          '75%': { transform: 'rotate(-20deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
