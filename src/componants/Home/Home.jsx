import { Box } from "@chakra-ui/react";
import Banner from "./Banners/Banner";
import MiniBanner from "./MiniBanner/MiniBanner";
import MediaRow from "./MiniCard/MediaRow";
import { Footer } from "./Footer/Footer";
import { useCatalog } from "../../context/CatalogContext";
import { useWatchlist } from "../../context/WatchlistContext";
import { HomeSkeleton } from "../common/Skeletons";

// The featured strip breaks up the rails roughly a third of the way down.
const FEATURE_STRIP_AFTER = 3;

function Home() {
  const { rows, featured, heroSlides, loading } = useCatalog();
  const { list } = useWatchlist();

  if (loading) return <HomeSkeleton />;

  // The first rail seeds a recognisable "Top 10" ranked strip.
  const topTen = rows[0]?.items.slice(0, 10) || [];

  return (
    <Box as="main" bg="surface.canvas">
      <Banner slides={heroSlides} />

      <Box pb={16}>
        {list.length > 0 && <MediaRow data={list} title="Up Next" />}

        {topTen.length >= 10 && (
          <MediaRow data={topTen} title="Top 10 This Week" ranked />
        )}

        {rows.map((row, index) => (
          <Box key={row.key}>
            <MediaRow data={row.items} title={row.title} subtitle={row.subtitle} />
            {index === FEATURE_STRIP_AFTER && featured?.length > 0 && (
              <MiniBanner data={featured} />
            )}
          </Box>
        ))}
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
