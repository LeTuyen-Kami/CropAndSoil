const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring))",
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Neutral colors
        neutral: {
          50: "var(--neutral-50)",
          100: "var(--neutral-100)",
          200: "var(--neutral-200)",
          300: "var(--neutral-300)",
          400: "var(--neutral-400)",
          500: "var(--neutral-500)",
          600: "var(--neutral-600)",
          900: "var(--neutral-900)",
          DEFAULT: "var(--neutral-500)",
        },

        // Primary colors
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          800: "var(--primary-800)",
          DEFAULT: "var(--primary-500)",
          foreground: "var(--primary-foreground)",
        },

        // Secondary colors
        secondary: {
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          800: "var(--secondary-800)",
          DEFAULT: "var(--secondary-500)",
          foreground: "var(--secondary-foreground)",
        },

        // Error colors
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          700: "var(--error-700)",
          DEFAULT: "var(--error-500)",
        },

        // Warning colors
        warning: {
          50: "var(--warning-50)",
          500: "var(--warning-500)",
          700: "var(--warning-700)",
          DEFAULT: "var(--warning-500)",
        },

        // Success colors
        success: {
          50: "var(--success-50)",
          500: "var(--success-500)",
          700: "var(--success-700)",
          DEFAULT: "var(--success-500)",
        },

        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
