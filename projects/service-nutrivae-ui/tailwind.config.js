/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base: {
          100: "var(--color-base-100)",
          200: "var(--color-base-200)",
          300: "var(--color-base-300)",
          content: "var(--color-base-content)"
        },
        content: "var(--color-base-content)",
        ink: "var(--color-base-content)",
        muted: "var(--color-muted)",
        canvas: "var(--color-base-100)",
        line: "var(--color-base-300)",
        primary: "var(--color-primary)",
        "primary-content": "var(--color-primary-content)",
        secondary: "var(--color-secondary)",
        "secondary-content": "var(--color-secondary-content)",
        accent: "var(--color-accent)",
        "accent-content": "var(--color-accent-content)",
        neutral: "var(--color-neutral)",
        "neutral-content": "var(--color-neutral-content)",
        info: "var(--color-info)",
        "info-content": "var(--color-info-content)",
        success: "var(--color-success)",
        "success-content": "var(--color-success-content)",
        warning: "var(--color-warning)",
        "warning-content": "var(--color-warning-content)",
        error: "var(--color-error)",
        "error-content": "var(--color-error-content)",
        brand: {
          50: "var(--color-primary-soft)",
          100: "var(--color-primary-soft-strong)",
          500: "var(--color-primary)",
          600: "var(--color-primary)",
          700: "var(--color-base-content)",
          900: "var(--color-neutral)"
        },
        coral: "var(--color-error)",
        butter: "var(--color-primary)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"]
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
        field: "var(--radius-field)",
        box: "var(--radius-box)",
        selector: "var(--radius-selector)"
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
        card: "var(--shadow-card)",
        float: "var(--shadow-modal)"
      },
      zIndex: {
        hide: "var(--depth-hide)",
        base: "var(--depth-base)",
        raised: "var(--depth-raised)",
        dropdown: "var(--depth-dropdown)",
        modal: "var(--depth-modal)",
        toast: "var(--depth-toast)"
      },
      backgroundImage: {
        noise: "var(--noise-pattern)"
      }
    }
  },
  plugins: []
};
