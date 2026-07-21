import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import MediaRow from "../Home/MiniCard/MediaRow";
import { useCatalog } from "../../context/CatalogContext";
import { HomeSkeleton } from "../common/Skeletons";
import { Reveal } from "../common/Reveal";
import { Footer } from "../Home/Footer/Footer";

/**
 * A filtered view of the home catalogue, reused by the Originals / Movies / Kids
 * nav destinations. Each category names the rails it wants; when none of those
 * rails exist (e.g. on the bundled local catalogue) it falls back to showing
 * everything, so the page is never empty.
 */
export const CATEGORIES = {
  originals: {
    title: "Apple TV+ Originals",
    blurb: "Award-winning series and films, only here.",
    keys: ["apple-originals", "top-tv", "scifi", "comedy"],
  },
  movies: {
    title: "Movies",
    blurb: "Blockbusters, classics, and critically acclaimed films.",
    keys: ["trending-movies", "popular-movies", "top-movies", "documentaries"],
  },
  kids: {
    title: "Kids & Family",
    blurb: "Shows and movies filled with wonder and imagination.",
    keys: ["kids", "comedy", "documentaries"],
  },
};

export const Browse = ({ category }) => {
  const { rows, loading } = useCatalog();
  const config = CATEGORIES[category];

  if (loading) return <HomeSkeleton />;

  const matched = rows.filter((row) => config.keys.includes(row.key));
  const shown = matched.length ? matched : rows;

  return (
    <Box as="main" bg="surface.canvas" minH="100vh">
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 24, md: 28 }} pb={2}>
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800">
          {config.title}
        </Heading>
        <Text mt={2} color="content.secondary">
          {config.blurb}
        </Text>
      </Box>

      <Box pb={16}>
        {shown.map((row) => (
          <Reveal key={row.key}>
            <MediaRow data={row.items} title={row.title} />
          </Reveal>
        ))}
      </Box>

      <Footer />
    </Box>
  );
};

export default Browse;
