import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Heading, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsPlayFill, BsInfoCircle, BsPlus, BsCheck2, BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getTitleDetails } from "../../../api/tmdb";
import { useWatchlist } from "../../../context/WatchlistContext";
import { TrailerModal } from "../../common/TrailerModal";

/**
 * Full-bleed hero. Apple leads with artwork and a very short line of copy, so the
 * slide itself carries almost no chrome — just a scrim to keep text legible over
 * unpredictable images, and progress bars that double as controls. Slides are
 * fed live from TMDB's trending titles (with a bundled fallback set).
 */

const AUTOPLAY_MS = 6500;

export default function Banner({ slides = [] }) {
  const navigate = useNavigate();
  const { has, toggle } = useWatchlist();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [trailer, setTrailer] = useState({ open: false, key: null, loading: false });
  const timerRef = useRef(null);

  const go = useCallback(
    (next) => setActive((current) => (next + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    // Respect users who have asked the OS to reduce motion — no auto-advance.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion || slides.length < 2) return undefined;

    timerRef.current = setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [active, paused, go, slides.length]);

  if (!slides.length) return null;
  const slide = slides[active];

  const openDetails = () => {
    if (slide.uid && slide.tmdbId) navigate(`/details/${slide.uid}`);
  };

  const playTrailer = async () => {
    // Fallback slides carry no TMDB id, so there's no trailer to fetch.
    if (!slide.tmdbId) {
      setTrailer({ open: true, key: null, loading: false });
      return;
    }
    setTrailer({ open: true, key: null, loading: true });
    try {
      const details = await getTitleDetails(slide.mediaType, slide.tmdbId);
      setTrailer({ open: true, key: details.trailerKey, loading: false });
    } catch {
      setTrailer({ open: true, key: null, loading: false });
    }
  };

  return (
    <Box
      as="section"
      aria-roledescription="carousel"
      aria-label="Featured titles"
      position="relative"
      height={{ base: "62vh", md: "78vh", lg: "88vh" }}
      minHeight="420px"
      overflow="hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((item, index) => (
        <Box
          key={item.uid || item.backdrop}
          position="absolute"
          inset={0}
          aria-hidden={index !== active}
          opacity={index === active ? 1 : 0}
          transition="opacity 0.9s ease"
          pointerEvents={index === active ? "auto" : "none"}
        >
          <Box
            position="absolute"
            inset={0}
            bgImage={`url(${item.backdrop})`}
            bgSize="cover"
            bgPosition="center"
            // Slow drift keeps a static image from feeling like a dead frame.
            transform={index === active ? "scale(1.06)" : "scale(1)"}
            transition="transform 7s ease-out"
          />
          {/* Two scrims: one for text legibility, one to melt into the page. */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-r, blackAlpha.800 0%, blackAlpha.500 45%, transparent 75%)"
          />
          <Box position="absolute" inset={0} bgGradient="linear(to-t, #000 0%, transparent 45%)" />
        </Box>
      ))}

      <Flex
        position="relative"
        height="100%"
        align="flex-end"
        px={{ base: 5, md: 10, lg: 16 }}
        pb={{ base: 16, md: 20 }}
      >
        <Stack spacing={{ base: 4, md: 5 }} maxW={{ base: "100%", md: "620px" }}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="content.secondary"
            >
              {slide.eyebrow || "Featured"}
            </Text>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
              fontWeight="800"
              lineHeight="1.02"
              mt={3}
              sx={{ textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
            >
              {slide.title}
            </Heading>

            {(slide.year || slide.rating || slide.mediaType) && (
              <HStack spacing={3} color="content.secondary" fontSize="sm" mt={3}>
                {slide.rating && slide.rating !== "0.0" && (
                  <HStack spacing={1}>
                    <BsStarFill size="12px" color="#f5c518" />
                    <Text>{slide.rating}</Text>
                  </HStack>
                )}
                {slide.year && <Text>{slide.year}</Text>}
                {slide.mediaType && (
                  <Text textTransform="uppercase" letterSpacing="0.08em">
                    {slide.mediaType === "tv" ? "Series" : "Film"}
                  </Text>
                )}
              </HStack>
            )}

            {slide.overview && (
              <Text fontSize={{ base: "md", md: "lg" }} color="content.secondary" noOfLines={3} mt={4}>
                {slide.overview}
              </Text>
            )}
          </motion.div>
          <HStack spacing={3} pt={2} flexWrap="wrap">
            <Button
              variant="hero"
              size="lg"
              leftIcon={trailer.loading ? <Spinner size="sm" /> : <BsPlayFill size="22px" />}
              px={8}
              onClick={playTrailer}
              isDisabled={trailer.loading}
            >
              Play
            </Button>
            {slide.tmdbId && (
              <>
                <Button
                  variant="glass"
                  size="lg"
                  px={6}
                  leftIcon={has(slide.uid) ? <BsCheck2 size="20px" /> : <BsPlus size="22px" />}
                  onClick={() => toggle(slide)}
                >
                  {has(slide.uid) ? "In Up Next" : "Up Next"}
                </Button>
                <Button variant="glass" size="lg" leftIcon={<BsInfoCircle size="18px" />} px={6} onClick={openDetails}>
                  Info
                </Button>
              </>
            )}
          </HStack>
        </Stack>
      </Flex>

      <HStack
        position="absolute"
        bottom={{ base: 5, md: 7 }}
        left={{ base: 5, md: 10, lg: 16 }}
        spacing={2}
        zIndex={2}
      >
        {slides.map((item, index) => (
          <Box
            key={item.uid || index}
            as="button"
            aria-label={`Show ${item.title}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
            height="3px"
            width={index === active ? "40px" : "20px"}
            borderRadius="full"
            bg={index === active ? "content.primary" : "whiteAlpha.500"}
            transition="width 0.3s ease, background 0.3s ease"
            _hover={{ bg: "content.primary" }}
          />
        ))}
      </HStack>

      <HStack
        position="absolute"
        bottom={{ base: 5, md: 7 }}
        right={{ base: 5, md: 10, lg: 16 }}
        spacing={2}
        zIndex={2}
        display={{ base: "none", md: "flex" }}
      >
        {[
          { label: "Previous slide", icon: <BiChevronLeft size="24px" />, step: -1 },
          { label: "Next slide", icon: <BiChevronRight size="24px" />, step: 1 },
        ].map((control) => (
          <Box
            key={control.label}
            as="button"
            aria-label={control.label}
            onClick={() => go(active + control.step)}
            display="grid"
            placeItems="center"
            boxSize="44px"
            borderRadius="full"
            bg="rgba(255,255,255,0.14)"
            backdropFilter="blur(20px)"
            border="1px solid"
            borderColor="surface.border"
            transition="background 0.2s ease, transform 0.2s ease"
            _hover={{ bg: "rgba(255,255,255,0.26)", transform: "scale(1.06)" }}
          >
            {control.icon}
          </Box>
        ))}
      </HStack>

      <TrailerModal
        isOpen={trailer.open}
        onClose={() => setTrailer({ open: false, key: null, loading: false })}
        trailerKey={trailer.key}
        title={slide.title}
      />
    </Box>
  );
}
