import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsPlayFill, BsPlus } from "react-icons/bs";
import { cards } from "../Data/Data";

/**
 * Full-bleed hero. Apple leads with artwork and a very short line of copy, so
 * the slide itself carries almost no chrome — just a scrim to keep text legible
 * over unpredictable images, and progress bars that double as controls.
 */

const COPY = [
  { title: "Ted Lasso", copy: "An American coach. An English club. Zero experience." },
  { title: "The Sky Is Everywhere", copy: "A story about grief, first love, and finding your sound." },
  { title: "Severance", copy: "Your work self and your home self will never meet." },
  { title: "Dear Edward", copy: "One survivor. A hundred lives changed forever." },
  { title: "The Morning Show", copy: "Behind the biggest story in American news." },
];

const SLIDES = cards.map((card, index) => ({
  image: card.image.trim(),
  eyebrow: "Apple Original",
  ...COPY[index],
}));

const AUTOPLAY_MS = 6500;

export default function Banner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((next) => {
    setActive((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    // Respect users who have asked the OS to reduce motion — no auto-advance.
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduceMotion) return undefined;

    timerRef.current = setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [active, paused, go]);

  return (
    <Box
      as="section"
      aria-roledescription="carousel"
      aria-label="Featured on Apple TV+"
      position="relative"
      height={{ base: "62vh", md: "78vh", lg: "88vh" }}
      minHeight="420px"
      overflow="hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {SLIDES.map((slide, index) => (
        <Box
          key={slide.image}
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
            bgImage={`url(${slide.image})`}
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
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-t, #000 0%, transparent 45%)"
          />
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
          <Text
            fontSize={{ base: "xs", md: "sm" }}
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color="content.secondary"
          >
            {SLIDES[active].eyebrow}
          </Text>
          <Heading
            as="h1"
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            fontWeight="800"
            lineHeight="1.02"
          >
            {SLIDES[active].title}
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} color="content.secondary">
            {SLIDES[active].copy}
          </Text>
          <HStack spacing={3} pt={2}>
            <Button variant="hero" size="lg" leftIcon={<BsPlayFill size="22px" />} px={8}>
              Play
            </Button>
            <Button variant="glass" size="lg" leftIcon={<BsPlus size="22px" />} px={6}>
              Up Next
            </Button>
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
        {SLIDES.map((slide, index) => (
          <Box
            key={slide.image}
            as="button"
            aria-label={`Show ${slide.title}`}
            aria-current={index === active}
            onClick={() => go(index)}
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
    </Box>
  );
}
