import React, { createContext, useContext, useEffect, useState } from "react";
import { getHomeCatalog, hasTmdbKey } from "../api/tmdb";
import { rows as localRows, featured as localFeatured } from "../componants/Home/Data/catalog";
import { cards } from "../componants/Home/Data/Data";

/**
 * Single source of truth for the home screen. Fetches the whole catalogue from
 * TMDB once, caches it in state, and exposes it to the hero, the rails and the
 * featured strip without prop-drilling or refetching between them.
 *
 * When there is no API key (or the network is down), it serves the bundled local
 * catalogue instead, so the app renders a full, sensible home screen either way.
 */

const CatalogContext = createContext(null);

// Hero copy for the offline/fallback catalogue — the local data carries artwork
// but no synopsis, so we supply a short line per bundled slide.
const FALLBACK_COPY = [
  { title: "Ted Lasso", overview: "An American coach. An English club. Zero experience." },
  { title: "The Sky Is Everywhere", overview: "A story about grief, first love, and finding your sound." },
  { title: "Severance", overview: "Your work self and your home self will never meet." },
  { title: "Dear Edward", overview: "One survivor. A hundred lives changed forever." },
  { title: "The Morning Show", overview: "Behind the biggest story in American news." },
];

const buildFallback = () => ({
  rows: localRows.map((row) => ({ key: row.key, title: row.title, items: row.items })),
  featured: localFeatured,
  heroSlides: cards.map((card, index) => ({
    uid: `fallback-hero-${index}`,
    eyebrow: "Apple Original",
    backdrop: card.image.trim(),
    ...FALLBACK_COPY[index % FALLBACK_COPY.length],
  })),
});

export const CatalogProvider = ({ children }) => {
  const [state, setState] = useState({
    rows: [],
    featured: [],
    heroSlides: [],
    loading: true,
    error: null,
    // "tmdb" once live data lands, "local" when we're on the bundled catalogue.
    source: hasTmdbKey ? "tmdb" : "local",
  });

  useEffect(() => {
    let active = true;

    if (!hasTmdbKey) {
      setState({ ...buildFallback(), loading: false, error: null, source: "local" });
      return undefined;
    }

    getHomeCatalog()
      .then((data) => {
        if (active) setState({ ...data, loading: false, error: null, source: "tmdb" });
      })
      .catch((err) => {
        // Any failure (bad key, rate limit, offline) degrades to local data
        // rather than leaving the screen empty.
        if (active)
          setState({ ...buildFallback(), loading: false, error: err, source: "local" });
      });

    return () => {
      active = false;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
};

export default CatalogContext;
