/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import daisyui from 'daisyui';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/util/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      flex: {
        full: '0 0 100%',
      },
      strokeWidth: {
        DEFAULT: '1',
        '0': '0',
        '1': '1',
        '2': '2',
      },
      screens: {
        xs: '420px',
        sm: '640px',
        md: '768px',
        //   lg: '1000px',
        lg: '1024px',
        //   xl: '1165px',
        xl: '1280px',
        dxl: '1300px',
        xxl: '1750px',
        mxl: '2055px',
      },
      lineClamp: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
        '14': '14',
        '15': '15',
      },
      gradients: {
        'lime-violet': 'linear-gradient(to right, #5029a6 0%, #8db600 100%)',
        'red-yellow': 'linear-gradient(to right, #f83600 0%, #f9d423 100%)',
        // Add more gradients as needed
      },
      colors: {
        // Business theme colors - professional grayscale palette
        business: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#9aa0a6',
          600: '#80868b',
          700: '#5f6368',
          800: '#3c4043',
          900: '#202124',
          950: '#171717',
        },
        // Neon theme colors - creative vibrant palette
        neon: {
          100: '#e8f0cc',
          200: '#d1e299',
          300: '#bbd366',
          400: '#a4c533',
          500: '#8db600',
          600: '#719200',
          700: '#556d00',
          800: '#384900',
          900: '#1c2400',
        },
        neon2: {
          100: '#dcd4ed',
          200: '#b9a9db',
          300: '#967fca',
          400: '#7354b8',
          500: '#5029a6',
          600: '#402185',
          700: '#301964',
          800: '#201042',
          900: '#100821',
        },
        // Theme-specific accent colors
        accent: '#8db600', // Neon green
        accent2: '#5029a6', // Neon purple
        accent3: '#7a3e6e', // Neon variant
        accent4: '#549412', // Neon success
        // Business accent (minimal, strategic use only)
        'business-accent': '#2563eb', // Professional blue for CTAs
        dark: {
          100: '#d5d8dc',
          200: '#abb2b9',
          300: '#808b96',
          400: '#566573',
          500: '#2c3e50',
          600: '#233240',
          700: '#1a2530',
          800: '#121920',
          900: '#090c10',
        },
        light: {
          100: '#fbfcfc',
          200: '#f7f9f9',
          300: '#f4f6f7',
          400: '#f0f3f4',
          500: '#ecf0f1',
          600: '#bdc0c1',
          700: '#8e9091',
          800: '#5e6060',
          900: '#2f3030',
        },
        x: {
          primary: '#1DA1F2', // Twitter Blue
          dark: '#14171A', // Twitter Dark
          light: '#AAB8C2', // Twitter Light
        },
        facebook: {
          primary: '#1877F2', // Facebook Blue
          dark: '#3b5998', // Facebook Dark
          light: '#8b9dc3', // Facebook Light
        },
        instagram: {
          primary: '#E4405F', // Instagram Red
          gradientStart: '#F58529', // Instagram Gradient Start
          gradientEnd: '#DD2A7B', // Instagram Gradient End
        },
        linkedin: {
          primary: '#0077B5', // LinkedIn Blue
          dark: '#004182', // LinkedIn Dark
          light: '#8AB4F8', // LinkedIn Light
        },
        youtube: {
          primary: '#FF0000', // YouTube Red
          dark: '#C4302B', // YouTube Dark
          light: '#FF8C00', // YouTube Light
        },
        tiktok: {
          primary: '#69C9D0', // TikTok Blue
          secondary: '#EE1D52', // TikTok Red
          dark: '#010101', // TikTok Dark
        },
        twitch: {
          primary: '#9146FF', // Twitch Purple
          dark: '#6441A5', // Twitch Dark
          light: '#B9A3E3', // Twitch Light
        },
        github: {
          primary: '#181717', // GitHub Black
          dark: '#0D1117', // GitHub Dark Mode
          light: '#F5F5F5', // GitHub Light Mode
        },
        threads: {
          primary: '#000000', // Threads Black
          dark: '#282828', // Threads Dark
          light: '#E0E0E0', // Threads Light
        },
        snapchat: {
          primary: '#FFFC00', // Snapchat Yellow
          dark: '#282828', // Snapchat Dark
          light: '#FFFFFF', // Snapchat Light
        },
        discord: {
          primary: '#5865F2', // Discord Blurple
          dark: '#23272A', // Discord Dark
          light: '#7289DA', // Discord Light
        },
        reddit: {
          primary: '#FF4500', // Reddit Orange
          dark: '#1A1A1B', // Reddit Dark Mode Background
          light: '#D7DADC', // Reddit Light Mode Background
        },

        // Shad CN Colors
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
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        17: '4.25rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        42: '10.5rem',
        46: '11.5rem',
        50: '12.5rem',
        54: '13.5rem',
        58: '14.5rem',
        62: '15.5rem',
        66: '16.5rem',
        70: '17.5rem',
        74: '18.5rem',
        78: '19.5rem',
        82: '20.5rem',
        86: '21.5rem',
        88: '22rem',
        90: '22.5rem',
        92: '23rem',
        94: '23.5rem',
        98: '24.5rem',
        100: '25rem',
        102: '25.5rem',
        104: '26rem',
        106: '26.5rem',
        108: '27rem',
        110: '27.5rem',
        112: '28rem',
        114: '28.5rem',
        116: '29rem',
        118: '29.5rem',
        120: '30rem',
        122: '30.5rem',
        124: '31rem',
        126: '31.5rem',
        128: '32rem',
        132: '33rem',
        136: '34rem',
        140: '35rem',
        144: '36rem',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
        'spin-slow': 'spin 6s linear infinite',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    daisyui,
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-animate'),
    plugin(({ theme, addUtilities }: { theme: any; addUtilities: (arg0: any) => void }) => {
      const neonUtilities: Record<string, any> = {};
      const colors = theme('colors');
      for (const color in colors) {
        if (typeof colors[color] === 'object') {
          const color1 = colors[color][300];
          const color2 = colors[color][600];
          neonUtilities[`.neon-${color}`] = {
            boxShadow: `0 0 5px ${color1}, 0 0 20px ${color2}`,
          };
        }
      }
      addUtilities(neonUtilities);
    }),
    plugin(({ theme, addUtilities }: { theme: any; addUtilities: (arg0: any) => void }) => {
      const innerGlowUtilities: Record<string, any> = {};
      const colors = theme('colors');
      const opacities = theme('opacity', {});

      for (const colorName in colors) {
        if (typeof colors[colorName] === 'object') {
          const color1 = colors[colorName][600];
          const color2 = colors[colorName][900];

          // Add the regular glow without opacity
          innerGlowUtilities[`.inner-glow-${colorName}`] = {
            boxShadow: `inset 0 0 10px ${color1}, inset 10px 10px 40px ${color2}`,
          };

          // Add versions with opacity
          for (const opacityName in opacities) {
            const opacityValue = opacities[opacityName];

            innerGlowUtilities[`.inner-glow-${colorName}-${opacityName}`] = {
              boxShadow: `inset 0 0 10px ${color1}${Math.round(opacityValue * 255)
                .toString(16)
                .padStart(2, '0')}, inset 10px 10px 40px ${color2}${Math.round(opacityValue * 255)
                .toString(16)
                .padStart(2, '0')}`,
            };
          }
        }
      }

      addUtilities(innerGlowUtilities);
    }),

    plugin(function ({ addUtilities, theme }) {
      const gradients = theme('gradients', {});
      const newUtilities: Record<string, any> = Object.keys(gradients).reduce(
        (acc, key) => {
          acc[`.text-gradient-${key}`] = {
            'background-image': gradients[key as keyof typeof gradients],
            'background-clip': 'text',
            '-webkit-background-clip': 'text',
            color: 'transparent',
          };
          return acc;
        },
        {} as Record<string, any>
      );
      addUtilities(newUtilities);
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.frosted-glass': {
          background: 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        '.frosted-glass-dark': {
          background: 'rgba(0, 0, 0, 0.25)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.18)',
          'box-shadow': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      };

      addUtilities(newUtilities);
    }),
    plugin(function ({ addUtilities, theme }) {
      const strokeWidths = theme('strokeWidth', {
        DEFAULT: '1',
        '0': '0.5',
        '1': '1',
        '2': '2',
      });

      const colors = theme('colors', {});

      // Define the type of utilities object
      const utilities: Record<string, Record<string, string>> = {};

      // Generate stroke width utilities
      Object.entries(strokeWidths).forEach(([key, value]) => {
        utilities[`.text-stroke${key === 'DEFAULT' ? '' : `-${key}`}`] = {
          '-webkit-text-stroke-width': `${value}px`,
          'paint-order': 'stroke fill',
        };
      });

      // Generate stroke color utilities
      Object.entries(colors as Record<string, string | Record<string, string>>).forEach(
        ([colorName, color]) => {
          if (typeof color === 'string') {
            utilities[`.text-stroke-${colorName}`] = {
              '-webkit-text-stroke-color': color,
              'paint-order': 'stroke fill',
            };
          } else if (typeof color === 'object' && color !== null) {
            Object.entries(color).forEach(([shade, shadeColor]) => {
              utilities[`.text-stroke-${colorName}-${shade}`] = {
                '-webkit-text-stroke-color': shadeColor,
                'paint-order': 'stroke fill',
              };
            });
          }
        }
      );

      addUtilities(utilities);
    }),
  ],
};
export default config;
