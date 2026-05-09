import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0E27',
          secondary: '#1A1F3A',
          card: '#151B2F',
          dark: '#0A0E27',
        },
        accent: {
          'neon-magenta': '#FF9FBE',
          'neon-pink': '#FFB8D1',
          'neon-cyan': '#7FD8E8',
          'neon-orange': '#FFB77D',
          'neon-lime': '#C8E8AA',
          'ocean-blue': '#6BB3D8',
          'purple-haze': '#C8A8E8',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B5C0',
          muted: '#6B7280',
        },
        status: {
          success: '#C8E8AA',
          error: '#FF9FBE',
          warning: '#FFB77D',
          info: '#7FD8E8',
        },
        border: 'rgba(127, 216, 232, 0.15)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.7' }],
        xl: ['1.25rem', { lineHeight: '1.8' }],
        '2xl': ['1.5rem', { lineHeight: '1.8' }],
        '3xl': ['1.875rem', { lineHeight: '1.8' }],
        '4xl': ['2.25rem', { lineHeight: '1.8' }],
        '5xl': ['3rem', { lineHeight: '1.8' }],
        '6xl': ['3.75rem', { lineHeight: '1.8' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      boxShadow: {
        'glow-magenta': '0 0 30px rgba(255, 159, 190, 0.6)',
        'glow-cyan': '0 0 30px rgba(127, 216, 232, 0.6)',
        'glow-orange': '0 0 30px rgba(255, 183, 125, 0.6)',
        'glow-lime': '0 0 30px rgba(200, 232, 170, 0.4)',
        'neon-magenta': '0 0 20px rgba(255, 159, 190, 0.8), 0 0 40px rgba(255, 159, 190, 0.4)',
        'neon-cyan': '0 0 20px rgba(127, 216, 232, 0.8), 0 0 40px rgba(127, 216, 232, 0.4)',
        'neon-border': 'inset 0 0 20px rgba(255, 159, 190, 0.2), 0 0 30px rgba(255, 159, 190, 0.1)',
      },
      backgroundImage: {
        'gradient-miami': 'linear-gradient(135deg, #FF9FBE 0%, #FFB77D 50%, #7FD8E8 100%)',
        'gradient-magenta-cyan': 'linear-gradient(90deg, #FF9FBE 0%, #7FD8E8 100%)',
        'gradient-orange-magenta': 'linear-gradient(135deg, #FFB77D 0%, #FF9FBE 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 1) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 159, 190, 0.1) 0%, rgba(127, 216, 232, 0.05) 100%)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': {
            transform: 'translateZ(0)',
            textShadow: '0 0 10px rgba(255, 159, 190, 0.6)',
          },
          '20%': {
            transform: 'translate(2px, 2px)',
            textShadow: '-2px -2px 0 rgba(127, 216, 232, 0.6)',
          },
          '40%': {
            transform: 'translate(-2px, 2px)',
            textShadow: '2px -2px 0 rgba(255, 183, 125, 0.6)',
          },
          '60%': {
            transform: 'translate(2px, -2px)',
            textShadow: '-2px 2px 0 rgba(200, 168, 232, 0.6)',
          },
          '80%': {
            transform: 'translate(-2px, -2px)',
            textShadow: '2px 2px 0 rgba(255, 159, 190, 0.6)',
          },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 159, 190, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 159, 190, 0.8)' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.5' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'hover-lift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        glitch: 'glitch 8s infinite',
        flip: 'flip 0.6s ease-in-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.15s infinite',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'hover-lift': 'hover-lift 0.3s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#FFFFFF',
            a: {
              color: '#FF9FBE',
              '&:hover': {
                color: '#7FD8E8',
              },
            },
            h1: {
              color: '#FFFFFF',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            },
            h2: {
              color: '#FFFFFF',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            },
            h3: {
              color: '#FFFFFF',
              fontFamily: 'Bebas Neue, sans-serif',
              letterSpacing: '0.025em',
            },
            h4: {
              color: '#FFFFFF',
            },
            strong: {
              color: '#FF9FBE',
            },
            code: {
              color: '#C8E8AA',
              backgroundColor: 'rgba(200, 168, 232, 0.15)',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontFamily: 'JetBrains Mono, monospace',
            },
            'pre code': {
              color: 'inherit',
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
            },
            pre: {
              backgroundColor: '#151B2F',
              borderColor: 'rgba(255, 0, 110, 0.2)',
              borderWidth: '1px',
            },
            blockquote: {
              color: '#B0B5C0',
              borderLeftColor: '#FF9FBE',
            },
            hr: {
              borderColor: 'rgba(255, 159, 190, 0.15)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
