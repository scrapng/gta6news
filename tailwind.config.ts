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
          primary: '#0a0a0f',
          secondary: '#12121a',
          card: '#1a1a26',
        },
        accent: {
          'neon-pink': '#ff2d78',
          'neon-cyan': '#00d4ff',
          'neon-yellow': '#ffd60a',
          purple: '#7b2fff',
        },
        text: {
          primary: '#f0f0f5',
          secondary: '#8888aa',
          muted: '#555566',
        },
        border: 'rgba(255, 45, 120, 0.15)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 45, 120, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.4)',
      },
      backgroundImage: {
        'gradient-neon':
          'linear-gradient(135deg, #ff2d78 0%, #7b2fff 50%, #00d4ff 100%)',
        'gradient-dark':
          'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(18, 18, 26, 1) 100%)',
      },
      keyframes: {
        glitch: {
          '0%, 100%': {
            transform: 'translateZ(0)',
            textShadow: '0 0 10px rgba(255, 45, 120, 0.5)',
          },
          '20%': {
            transform: 'translate(2px, 2px)',
            textShadow: '-2px -2px 0 rgba(0, 212, 255, 0.5)',
          },
          '40%': {
            transform: 'translate(-2px, 2px)',
            textShadow: '2px -2px 0 rgba(255, 214, 10, 0.5)',
          },
          '60%': {
            transform: 'translate(2px, -2px)',
            textShadow: '-2px 2px 0 rgba(123, 47, 255, 0.5)',
          },
          '80%': {
            transform: 'translate(-2px, -2px)',
            textShadow: '2px 2px 0 rgba(255, 45, 120, 0.5)',
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
      },
      animation: {
        glitch: 'glitch 8s infinite',
        flip: 'flip 0.6s ease-in-out',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#f0f0f5',
            a: {
              color: '#ff2d78',
              '&:hover': {
                color: '#00d4ff',
              },
            },
            h1: {
              color: '#f0f0f5',
              fontFamily: 'Bebas Neue, sans-serif',
            },
            h2: {
              color: '#f0f0f5',
              fontFamily: 'Bebas Neue, sans-serif',
            },
            h3: {
              color: '#f0f0f5',
              fontFamily: 'Bebas Neue, sans-serif',
            },
            h4: {
              color: '#f0f0f5',
            },
            strong: {
              color: '#ff2d78',
            },
            code: {
              color: '#ffd60a',
              backgroundColor: 'rgba(123, 47, 255, 0.1)',
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
              backgroundColor: '#1a1a26',
              borderColor: 'rgba(255, 45, 120, 0.15)',
              borderWidth: '1px',
            },
            blockquote: {
              color: '#8888aa',
              borderLeftColor: '#ff2d78',
            },
            hr: {
              borderColor: 'rgba(255, 45, 120, 0.15)',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
