import React, { useCallback, useEffect, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";

const AUTOPLAY_MS = 5000;

export default function MiniBanner({ data = [] }) {
  const [active, setActive] = useState(0);

  const go = useCallback(
    (next) => setActive((next + data.length) % data.length),
    [data.length]
  );

  useEffect(() => {
    if (!data.length) return undefined;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const timer = setInterval(() => go(active + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [active, go, data.length]);

  if (!data.length) return null;

  return (
    <Box as="section" aria-label="Featured collections" px={{ base: 5, md: 10, lg: 16 }} py={{ base: 10, md: 14 }}>
      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="0 20px 60px rgba(0,0,0,0.6)"
        sx={{ aspectRatio: ["16 / 9", null, "1320 / 495"] }}
      >
        {data.map((slide, index) => (
          <Box
            key={slide.uid || index}
            position="absolute"
            inset={0}
            bgImage={`url(${slide.image})`}
            bgSize="cover"
            bgPosition="center"
            opacity={index === active ? 1 : 0}
            transition="opacity 0.8s ease"
            aria-hidden={index !== active}
          />
        ))}

        <HStack position="absolute" bottom={4} left="50%" transform="translateX(-50%)" spacing={2}>
          {data.map((slide, index) => (
            <Box
              key={slide.uid || index}
              as="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === active}
              onClick={() => go(index)}
              boxSize="8px"
              borderRadius="full"
              bg={index === active ? "content.primary" : "whiteAlpha.500"}
              transition="background 0.3s ease, transform 0.3s ease"
              _hover={{ bg: "content.primary", transform: "scale(1.25)" }}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
