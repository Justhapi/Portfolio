import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--ff-serif)", "Georgia", "serif"],
        sans: ["var(--ff-sans)", "system-ui", "sans-serif"],
        hand: ["var(--ff-hand)", "cursive"],
        round: ["var(--ff-round)", "cursive"],
      },
      colors: {
        cream: "var(--bg)",
        "cream-alt": "var(--bg-alt)",
        ink: "var(--text)",
        "ink-mid": "var(--text-mid)",
        "ink-muted": "var(--text-muted)",
        "ink-light": "var(--text-light)",
        "ink-dark": "var(--text-dark)",
        lilac: "var(--lilac)",
        "lilac-mid": "var(--lilac-mid)",
        "lilac-light": "var(--lilac-light)",
        "lilac-pale": "var(--lilac-pale)",
        yellow: "var(--yellow)",
        "yellow-mid": "var(--yellow-mid)",
        "yellow-pale": "var(--yellow-pale)",
        "bg-dark": "var(--bg-dark)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
      },
    },
  },
  plugins: [],
};

export default config;
