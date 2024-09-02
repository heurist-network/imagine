import type { Config } from 'tailwindcss'

import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '32px',
    },
    extend: {
      fontFamily: {
        SFMono: ['var(--font-sf-mono)'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        filter: {
          'blur-20': 'blur(20px)',
          'blur-25': 'blur(25px)',
        },
      },
      transitionTimingFunction: {
        slow: 'cubic-bezier(.405, 0, .025, 1)',
        'minor-spring': 'cubic-bezier(0.18,0.89,0.82,1.04)',
      },
      backgroundImage: {
        logo: 'linear-gradient(to right,#C57CFF,#FF71D4,#FF80A2,#FFA676)',
        'section-title':
          'linear-gradient(91deg,rgb(192,132,252,0.7) 20.12%,#c084fc 55.27%,rgb(192,132,252,0.7) 82.61%)',
        'sub-section-title':
          'linear-gradient(91deg,#474747 20.12%,#000 55.27%,#474747 82.61%)',
        'campaign-preview': "url('/campaign/preview-bg.png')",
        'campaign-reward-work': "url('/campaign/reward-work-bg.png')",
        'new-label':
          'linear-gradient(180deg,#CDF138,#23a4ff 37.88%,#FEDF17 75%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDuration: {
        image: '368ms',
      },
      keyframes: {
        'bounce-horizontal': {
          '0%': {
            transform: 'translateX(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
          '100%': {
            transform: 'translateX(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        flow: {
          '0%': { backgroundPosition: '0 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0 50%' },
        },
        shimmer: {
          '0%, 90%, 100%': {
            'background-position': 'calc(-100% - var(--shimmer-width)) 0',
          },
          '30%, 60%': {
            'background-position': 'calc(100% + var(--shimmer-width)) 0',
          },
        },
        gradient: {
          to: {
            backgroundPosition: 'var(--bg-size) 0',
          },
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 var(--pulse-color)' },
          '50%': { boxShadow: '0 0 0 8px var(--pulse-color)' },
        },

        // magic-ui
        'spin-around': {
          '0%': {
            transform: 'translateZ(0) rotate(0)',
          },
          '15%, 35%': {
            transform: 'translateZ(0) rotate(90deg)',
          },
          '65%, 85%': {
            transform: 'translateZ(0) rotate(270deg)',
          },
          '100%': {
            transform: 'translateZ(0) rotate(360deg)',
          },
        },
        slide: {
          to: {
            transform: 'translate(calc(100cqw - 100%), 0)',
          },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' },
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' },
        },
        'pop-blob': {
          '0%': { transform: 'scale(1) translateX(0%) translateY(0%)' },
          '33%': { transform: 'scale(1.1) translateX(10%) translateY(10%)' },
          '66%': { transform: 'scale(0.9) translateX(-10%) translateY(-10%)' },
          '100%': { transform: 'scale(1) translateX(0%) translateY(0%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        flow: 'flow 6s linear infinite',
        'bounce-horizontal': 'bounce-horizontal 1s infinite',
        shimmer: 'shimmer 8s infinite',
        gradient: 'gradient 8s linear infinite',
        pulse: 'pulse var(--duration) ease-out infinite',
        // magic-ui
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        slide: 'slide var(--speed) ease-in-out infinite alternate',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'pop-blob': 'pop-blob 5s infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    iconsPlugin({
      collections: getIconCollections(['f7', 'ri', 'mingcute']),
    }),
  ],
} satisfies Config

export default config
