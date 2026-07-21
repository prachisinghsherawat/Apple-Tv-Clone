import { Box } from "@chakra-ui/react";

/**
 * The previous navbar hotlinked a Google-cached thumbnail for the wordmark,
 * which is fragile and renders at whatever size the remote file happens to be.
 * Drawing it inline keeps it crisp at any density and removes the network hop.
 */
const AppleTvLogo = ({ height = "22px" }) => (
  <Box
    as="svg"
    viewBox="0 0 84 24"
    height={height}
    display="block"
    fill="currentColor"
    color="content.primary"
    role="img"
    aria-label="Apple TV+"
  >
    {/* Apple mark */}
    <path d="M14.32 12.79c-.02-2.53 2.07-3.75 2.16-3.81-1.18-1.72-3.01-1.96-3.66-1.98-1.56-.16-3.04.92-3.83.92-.79 0-2.01-.9-3.3-.87-1.7.02-3.27.99-4.14 2.51-1.77 3.06-.45 7.59 1.27 10.07.84 1.21 1.84 2.57 3.16 2.52 1.27-.05 1.75-.82 3.28-.82s1.96.82 3.3.79c1.36-.02 2.23-1.23 3.06-2.45.97-1.4 1.36-2.76 1.38-2.83-.03-.01-2.65-1.02-2.68-4.05zM11.8 5.35c.7-.85 1.17-2.03 1.04-3.2-1.01.04-2.23.67-2.95 1.52-.65.75-1.22 1.95-1.07 3.1 1.13.09 2.28-.57 2.98-1.42z" />
    {/* TV wordmark */}
    <path d="M26.9 6.6h-4.4V4.3h11.5v2.3h-4.4v13.4h-2.7V6.6zM39.8 20l-5.6-15.7h2.9l4.1 12.2h.1l4.1-12.2h2.9L42.7 20h-2.9z" />
    {/* Plus */}
    <path d="M56.1 8.7h2.1v3.9h3.9v2.1h-3.9v3.9h-2.1v-3.9h-3.9v-2.1h3.9V8.7z" />
  </Box>
);

export default AppleTvLogo;
