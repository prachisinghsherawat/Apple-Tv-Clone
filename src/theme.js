import { extendTheme } from "@chakra-ui/react";

/**
 * Apple TV+ runs on a near-black canvas with a single high-contrast accent.
 * Everything here is tuned around that: dim surfaces, bright text, no colour
 * competing with the artwork.
 */
const colors = {
  brand: {
    50: "#e9f2ff",
    100: "#c7dcff",
    200: "#9ec2ff",
    300: "#6ea3ff",
    400: "#3d84ff",
    500: "#0a84ff", // Apple's system blue
    600: "#0069d9",
    700: "#0050a6",
    800: "#003773",
    900: "#001f40",
  },
  surface: {
    canvas: "#000000",
    raised: "#101012",
    overlay: "#1c1c1e",
    border: "rgba(255,255,255,0.12)",
  },
  content: {
    primary: "#f5f5f7",
    secondary: "#a1a1a6",
    muted: "#6e6e73",
  },
};

const fonts = {
  heading:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  body: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 600,
      borderRadius: "full",
      letterSpacing: "-0.01em",
    },
    variants: {
      // The primary call-to-action on hero surfaces: white pill on dark art.
      hero: {
        bg: "content.primary",
        color: "black",
        _hover: { bg: "white", transform: "scale(1.03)" },
        _active: { transform: "scale(0.98)" },
        transition: "transform 0.18s ease, background 0.18s ease",
      },
      // Sits on top of imagery, so it needs a blur rather than a solid fill.
      glass: {
        bg: "rgba(255,255,255,0.14)",
        color: "content.primary",
        backdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: "surface.border",
        _hover: { bg: "rgba(255,255,255,0.24)" },
      },
    },
  },
  Heading: {
    baseStyle: {
      letterSpacing: "-0.02em",
      color: "content.primary",
    },
  },
  Input: {
    variants: {
      filled: {
        field: {
          bg: "surface.overlay",
          border: "1px solid",
          borderColor: "surface.border",
          color: "content.primary",
          _hover: { bg: "surface.overlay" },
          _placeholder: { color: "content.muted" },
          _focus: {
            bg: "surface.overlay",
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          },
        },
      },
    },
    defaultProps: { variant: "filled" },
  },
};

const styles = {
  global: {
    "html, body, #root": {
      bg: "surface.canvas",
      color: "content.primary",
    },
    body: {
      // Long horizontal rows must never let the page itself scroll sideways.
      overflowX: "hidden",
    },
    "::selection": {
      bg: "brand.500",
      color: "white",
    },
    "::-webkit-scrollbar": { width: "10px", height: "10px" },
    "::-webkit-scrollbar-track": { bg: "transparent" },
    "::-webkit-scrollbar-thumb": {
      bg: "rgba(255,255,255,0.18)",
      borderRadius: "full",
    },
    "::-webkit-scrollbar-thumb:hover": { bg: "rgba(255,255,255,0.3)" },
  },
};

export const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  colors,
  fonts,
  components,
  styles,
  radii: { card: "14px" },
});

export default theme;
