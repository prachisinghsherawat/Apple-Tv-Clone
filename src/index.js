import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./Redux/store";
import { CatalogProvider } from "./context/CatalogContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import theme from "./theme";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <CatalogProvider>
            <WatchlistProvider>
              <App />
            </WatchlistProvider>
          </CatalogProvider>
        </BrowserRouter>
      </ChakraProvider>
    </Provider>
  </React.StrictMode>
);
