import React from "react";
import { Box, Flex, Skeleton } from "@chakra-ui/react";

const SECTION_X = { base: 5, md: 10, lg: 16 };

// A pulsing placeholder rail, sized to match a real MediaRow so the layout
// doesn't jump when live data arrives.
const RowSkeleton = () => (
  <Box pt={{ base: 8, md: 12 }}>
    <Box px={SECTION_X} pb={4}>
      <Skeleton height="22px" width="220px" borderRadius="md" startColor="surface.raised" endColor="surface.overlay" />
    </Box>
    <Flex gap={{ base: 3, md: 4 }} px={SECTION_X} overflow="hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton
          key={i}
          flex="0 0 auto"
          width={{ base: "260px", md: "300px", lg: "336px" }}
          sx={{ aspectRatio: "16 / 9" }}
          borderRadius="card"
          startColor="surface.raised"
          endColor="surface.overlay"
        />
      ))}
    </Flex>
  </Box>
);

export const HomeSkeleton = () => (
  <Box>
    <Skeleton
      height={{ base: "62vh", md: "78vh", lg: "88vh" }}
      minHeight="420px"
      startColor="surface.raised"
      endColor="surface.overlay"
    />
    <Box pb={16}>
      {Array.from({ length: 3 }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </Box>
  </Box>
);

export const DetailsSkeleton = () => (
  <Box>
    <Skeleton
      height={{ base: "56vw", md: "76vh" }}
      minHeight="300px"
      startColor="surface.raised"
      endColor="surface.overlay"
    />
    <RowSkeleton />
    <RowSkeleton />
  </Box>
);

export default HomeSkeleton;
