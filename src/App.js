import { Box } from "@chakra-ui/react";
import { AllRoutes } from "./componants/AllRoutes/AllRoutes";
import Navbar from "./componants/Home/Navbar/Navbar";
import ScrollToTop from "./componants/AllRoutes/ScrollToTop";
import "./App.css";

function App() {
  return (
    <Box bg="surface.canvas" minH="100vh">
      <ScrollToTop />
      <Navbar />
      <AllRoutes />
    </Box>
  );
}

export default App;
