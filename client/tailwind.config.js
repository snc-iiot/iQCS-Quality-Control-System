import tailwindAnimate from "tailwindcss-animate";

const convertToRGB = (variableName) => `rgba(var(${variableName}))`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        line: {
          green: {
            DEFAULT: convertToRGB("--line-green"),
            highlighted: convertToRGB("--line-green-highlighted"),
          },
          white: {
            DEFAULT: convertToRGB("--line-gray-white"),
            highlighted: convertToRGB("--line-gray-white-highlighted"),
          },
          black: convertToRGB("--line-gray-black"),
          gray: {
            100: convertToRGB("--line-gray-100"),
            150: convertToRGB("--line-gray-150"),
            200: convertToRGB("--line-gray-200"),
            250: convertToRGB("--line-gray-250"),
            300: convertToRGB("--line-gray-300"),
            350: convertToRGB("--line-gray-350"),
            400: convertToRGB("--line-gray-400"),
            500: convertToRGB("--line-gray-500"),
            600: convertToRGB("--line-gray-600"),
            700: convertToRGB("--line-gray-700"),
            750: convertToRGB("--line-gray-750"),
            770: convertToRGB("--line-gray-770"),
            800: convertToRGB("--line-gray-800"),
            850: convertToRGB("--line-gray-850"),
            870: convertToRGB("--line-gray-870"),
            900: convertToRGB("--line-gray-900"),
          },
          blue: {
            400: convertToRGB("--line-blue-400"),
            500: convertToRGB("--line-blue-500"),
            600: convertToRGB("--line-blue-600"),
            700: convertToRGB("--line-blue-700"),
          },
          navy: {
            400: convertToRGB("--line-navy-400"),
            500: convertToRGB("--line-navy-500"),
            600: convertToRGB("--line-navy-600"),
            700: convertToRGB("--line-navy-700"),
            800: convertToRGB("--line-navy-800"),
            850: convertToRGB("--line-navy-850"),
            900: convertToRGB("--line-navy-900"),
          },
          red: convertToRGB("--line-red"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.1s ease-out",
        "accordion-up": "accordion-up 0.1s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
};
