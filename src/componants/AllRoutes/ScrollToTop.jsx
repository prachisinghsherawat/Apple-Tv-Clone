import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Navigating from a rail deep in the page used to land mid-scroll on the
// details view. Reset to the top on every route change.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
