import { Box } from "@chakra-ui/react";
import { AllRoutes } from "./componants/AllRoutes/AllRoutes";
import Navbar from "./componants/Home/Navbar/Navbar";
import ScrollToTop from "./componants/AllRoutes/ScrollToTop";
import "./App.css";

function App() {
  return (
    <Box bg="surface.canvas" minH="100vh" position="relative" overflowX="hidden">
      {/* Faint ambient glow so the black canvas reads as depth, not a flat void. */}
      <Box
        aria-hidden
        position="fixed"
        inset={0}
        zIndex={0}
        pointerEvents="none"
        bgGradient="radial(1100px 520px at 15% -5%, rgba(10,132,255,0.10), transparent 62%)"
      />
      <Box position="relative" zIndex={1}>
        <ScrollToTop />
        <Navbar />
        <AllRoutes />
      </Box>
    </Box>
  );
}

export default App;
