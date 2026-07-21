import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * The "Up Next" watchlist. Persists to localStorage so a user's saved titles
 * survive a refresh, and drives every "Up Next" / "+" control in the app plus
 * the My List page. Only the fields the cards and rows need are stored.
 */

const STORAGE_KEY = "appletv.upnext.v1";

const WatchlistContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Keep the stored record small and stable regardless of where the item came from.
const slim = (item) => ({
  uid: item.uid,
  title: item.title || item.info || "Untitled",
  image: item.image || item.backdrop || item.poster,
  mediaType: item.mediaType || null,
  tmdbId: item.tmdbId || null,
  year: item.year || null,
  rating: item.rating || null,
});

export const WatchlistProvider = ({ children }) => {
  const [list, setList] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* storage full or unavailable — the in-memory list still works */
    }
  }, [list]);

  const has = useCallback((uid) => list.some((item) => item.uid === uid), [list]);

  const add = useCallback((item) => {
    if (!item?.uid) return;
    setList((current) =>
      current.some((existing) => existing.uid === item.uid) ? current : [slim(item), ...current]
    );
  }, []);

  const remove = useCallback((uid) => {
    setList((current) => current.filter((item) => item.uid !== uid));
  }, []);

  const toggle = useCallback((item) => {
    if (!item?.uid) return;
    setList((current) =>
      current.some((existing) => existing.uid === item.uid)
        ? current.filter((existing) => existing.uid !== item.uid)
        : [slim(item), ...current]
    );
  }, []);

  const value = useMemo(
    () => ({ list, has, add, remove, toggle, count: list.length }),
    [list, has, add, remove, toggle]
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within a WatchlistProvider");
  return ctx;
};

export default WatchlistContext;
