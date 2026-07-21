import React, { useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BsCheck2, BsPlayFill, BsPlus, BsStarFill } from "react-icons/bs";
import { getTitleDetails } from "../../api/tmdb";
import { useWatchlist } from "../../context/WatchlistContext";
import { findByUid, relatedTo } from "../Home/Data/catalog";
import { CastData } from "../Home/Data/DetailsData";
import { Footer } from "../Home/Footer/Footer";
import { DetailsMain } from "./DetailsMain";
import { DetailsSkeleton } from "../common/Skeletons";
import { TrailerModal } from "../common/TrailerModal";

const TMDB_UID = /^(tv|movie)-(\d+)$/;

/** Shape a bundled local catalogue item into the same object TMDB details use. */
const fromLocal = (uid) => {
  const item = findByUid(uid);
  if (!item) return null;
  return {
    uid,
    title: item.title || item.info || "Featured on Apple TV+",
    overview: item.info && item.title ? item.info : "",
    backdrop: item.image,
    year: null,
    rating: null,
    genres: item.rowTitle ? [item.rowTitle] : [],
    runtime: null,
    seasons: null,
    tagline: "",
    trailerKey: null,
    video: item.video || null,
    cast: CastData.map((p) => ({ name: p.name, role: p.role, image: p.image?.trim() })),
    related: relatedTo(uid),
  };
};

const runtimeLabel = (details) => {
  if (details.seasons) return `${details.seasons} Season${details.seasons > 1 ? "s" : ""}`;
  if (details.runtime) return `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`;
  return null;
};

export const HomeDetails = () => {
  const { id } = useParams();
  const { has, toggle } = useWatchlist();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDetails(null);

    const match = id.match(TMDB_UID);
    if (match) {
      getTitleDetails(match[1], match[2])
        .then((data) => active && setDetails(data))
        .catch(() => active && setDetails(fromLocal(id)))
        .finally(() => active && setLoading(false));
    } else {
      setDetails(fromLocal(id));
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  const meta = useMemo(() => (details ? runtimeLabel(details) : null), [details]);

  if (loading) return <DetailsSkeleton />;

  if (!details) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={5} px={6}>
        <Heading size="lg">We couldn't find that title</Heading>
        <Text color="content.secondary" textAlign="center">
          It may have left the catalogue, or the link is out of date.
        </Text>
        <Button as={RouterLink} to="/" variant="hero" size="lg">
          Back to Home
        </Button>
      </Flex>
    );
  }

  const canPlay = Boolean(details.trailerKey || details.video);

  return (
    <Box as="main" bg="surface.canvas">
      <Box position="relative" minHeight={{ base: "70vh", md: "82vh" }} bg="black">
        <Box position="absolute" inset={0} bgImage={`url(${details.backdrop})`} bgSize="cover" bgPosition="center" />
        <Box position="absolute" inset={0} bgGradient="linear(to-t, #000 6%, blackAlpha.500 45%, blackAlpha.300 100%)" />
        <Box position="absolute" inset={0} bgGradient="linear(to-r, blackAlpha.700 0%, transparent 70%)" />

        <Flex position="relative" height="100%" align="flex-end" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 28, md: 40 }} pb={{ base: 8, md: 14 }}>
          <Stack spacing={4} maxW="720px">
            <HStack spacing={3} flexWrap="wrap">
              <Badge bg="whiteAlpha.300" color="content.primary" borderRadius="md" px={2} py={1} fontSize="xs">
                {details.mediaType === "tv" ? "Series" : details.mediaType === "movie" ? "Film" : "Apple Original"}
              </Badge>
              {details.year && <Text fontSize="sm" color="content.secondary">{details.year}</Text>}
              {meta && <Text fontSize="sm" color="content.secondary">{meta}</Text>}
              {details.rating && details.rating !== "0.0" && (
                <HStack spacing={1} color="content.secondary">
                  <BsStarFill size="12px" color="#f5c518" />
                  <Text fontSize="sm">{details.rating}</Text>
                </HStack>
              )}
            </HStack>

            <Heading as="h1" fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }} fontWeight="800" lineHeight="1.02">
              {details.title}
            </Heading>

            {details.genres?.length > 0 && (
              <Text fontSize="sm" color="content.muted">{details.genres.slice(0, 4).join("  ·  ")}</Text>
            )}

            {(details.tagline || details.overview) && (
              <Text fontSize={{ base: "sm", md: "md" }} color="content.secondary" noOfLines={4}>
                {details.overview || details.tagline}
              </Text>
            )}

            <HStack spacing={3} pt={2}>
              <Button variant="hero" size="lg" px={8} leftIcon={<BsPlayFill size="22px" />} onClick={() => setTrailerOpen(true)} isDisabled={!canPlay}>
                {canPlay ? "Play Trailer" : "Trailer Unavailable"}
              </Button>
              <Button
                variant="glass"
                size="lg"
                px={6}
                leftIcon={has(details.uid) ? <BsCheck2 size="22px" /> : <BsPlus size="22px" />}
                onClick={() =>
                  toggle({
                    uid: details.uid,
                    title: details.title,
                    image: details.backdrop,
                    mediaType: details.mediaType,
                    year: details.year,
                    rating: details.rating,
                  })
                }
              >
                {has(details.uid) ? "In Up Next" : "Up Next"}
              </Button>
            </HStack>
          </Stack>
        </Flex>
      </Box>

      <DetailsMain details={details} />
      <Footer />

      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerKey={details.trailerKey}
        videoSrc={details.video}
        title={details.title}
      />
    </Box>
  );
};

export default HomeDetails;
