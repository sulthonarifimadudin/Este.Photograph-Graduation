import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary": "#7d562d",
        "on-secondary-fixed": "#2c1600",
        "on-tertiary": "#ffffff",
        "primary-fixed-dim": "#d1c4bc",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e4e2de",
        "error-container": "#ffdad6",
        "on-tertiary-container": "#aa867c",
        "primary": "#18120d",
        "outline-variant": "#d0c4bd",
        "on-background": "#1b1c1a",
        "on-tertiary-fixed-variant": "#5d4038",
        "tertiary-fixed-dim": "#e6bdb2",
        "secondary-fixed-dim": "#f0bd8b",
        "secondary-fixed": "#ffdcbd",
        "surface-container": "#efeeea",
        "surface-container-low": "#f5f3ef",
        "inverse-surface": "#30312e",
        "surface-container-high": "#eae8e4",
        "secondary-container": "#ffca98",
        "on-tertiary-fixed": "#2c160f",
        "surface-bright": "#fbf9f5",
        "surface": "#fbf9f5",
        "on-primary-fixed": "#211a16",
        "on-primary-container": "#978c85",
        "tertiary-container": "#39211a",
        "on-error": "#ffffff",
        "primary-container": "#2d2621",
        "inverse-primary": "#d1c4bc",
        "on-surface-variant": "#4d4540",
        "surface-tint": "#665d56",
        "surface-dim": "#dbdad6",
        "on-secondary-fixed-variant": "#623f18",
        "on-primary-fixed-variant": "#4d453f",
        "on-secondary": "#ffffff",
        "error": "#ba1a1a",
        "on-secondary-container": "#7a532a",
        "surface-container-highest": "#e4e2de",
        "background": "#fbf9f5",
        "tertiary": "#210d07",
        "on-surface": "#1b1c1a",
        "on-error-container": "#93000a",
        "primary-fixed": "#ede0d8",
        "on-primary": "#ffffff",
        "outline": "#7f756f",
        "tertiary-fixed": "#ffdbd1",
        "inverse-on-surface": "#f2f0ed"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "8px",
        "container-max": "1440px",
        "gutter": "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "stack-lg": "80px",
        "stack-md": "48px"
      },
      fontFamily: {
        "body-md": ["var(--font-manrope)", "sans-serif"],
        "headline-xl-mobile": ["var(--font-made)", "sans-serif"],
        "headline-lg": ["var(--font-made)", "sans-serif"],
        "label-caps": ["var(--font-made)", "sans-serif"],
        "editorial-accent": ["var(--font-script)", "cursive"],
        "body-lg": ["var(--font-manrope)", "sans-serif"],
        "display-lg": ["var(--font-made)", "sans-serif"],
        "headline-xl": ["var(--font-made)", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "headline-xl-mobile": ["36px", { "lineHeight": "44px", "fontWeight": "700" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "600" }],
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.1em", "fontWeight": "700" }],
        "editorial-accent": ["28px", { "lineHeight": "32px", "fontWeight": "400", "fontStyle": "italic" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "display-lg": ["84px", { "lineHeight": "90px", "letterSpacing": "-0.04em", "fontWeight": "800" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }]
      }
    },
  },
  plugins: [],
};

export default config;
