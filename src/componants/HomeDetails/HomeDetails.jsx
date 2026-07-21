import React, { useMemo, useRef, useState } from "react";
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
import { BsPlayFill, BsPlus } from "react-icons/bs";
import { findByUid, relatedTo } from "../Home/Data/catalog";
import { Footer } from "../Home/Footer/Footer";
import { DetailsMain } from "./DetailsMain";

export const HomeDetails = () => {
  const { id } = useParams();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const item = useMemo(() => findByUid(id), [id]);
  const related = useMemo(() => relatedTo(id), [id]);

  if (!item) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={5} px={6}>
        <Heading size="lg">We couldn't find that title</Heading>
        <Text color="content.secondary" textAlign="center">
          It may have left Apple TV+, or the link is out of date.
        </Text>
        <Button as={RouterLink} to="/" variant="hero" size="lg">
          Back to Home
        </Button>
      </Flex>
    );
  }

  const startPlayback = () => {
    setPlaying(true);
    // The element only mounts once playing, so defer the play() call a tick.
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <Box as="main" bg="surface.canvas">
      <Box position="relative" height={{ base: "56vw", md: "76vh" }} minHeight="300px" bg="black">
        {playing && item.video ? (
          <Box
            as="video"
            ref={videoRef}
            src={item.video}
            controls
            autoPlay
            playsInline
            width="100%"
            height="100%"
            objectFit="contain"
            bg="black"
          />
        ) : (
          <>
            <Box
              position="absolute"
              inset={0}
              bgImage={`url(${item.image})`}
              bgSize="cover"
              bgPosition="center"
            />
            <Box position="absolute" inset={0} bgGradient="linear(to-t, #000 0%, blackAlpha.600 40%, blackAlpha.300 100%)" />

            <Flex
              position="relative"
              height="100%"
              align="flex-end"
              px={{ base: 5, md: 10, lg: 16 }}
              pb={{ base: 8, md: 14 }}
            >
              <Stack spacing={4} maxW="640px">
                <HStack spacing={3}>
                  <Badge bg="whiteAlpha.300" color="content.primary" borderRadius="md" px={2} py={1} fontSize="xs">
                    Apple Original
                  </Badge>
                  <Text fontSize="sm" color="content.secondary">
                    {item.rowTitle}
                  </Text>
                </HStack>

                <Heading as="h1" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight="800">
                  {item.title || item.info || "Featured on Apple TV+"}
                </Heading>

                {item.info && item.title && (
                  <Text fontSize={{ base: "sm", md: "md" }} color="content.secondary">
                    {item.info}
                  </Text>
                )}

                <HStack spacing={3} pt={1}>
                  <Button
                    variant="hero"
                    size="lg"
                    px={8}
                    leftIcon={<BsPlayFill size="22px" />}
                    onClick={startPlayback}
                    isDisabled={!item.video}
                  >
                    {item.video ? "Play" : "Trailer Unavailable"}
                  </Button>
                  <Button variant="glass" size="lg" px={6} leftIcon={<BsPlus size="22px" />}>
                    Up Next
                  </Button>
                </HStack>
              </Stack>
            </Flex>
          </>
        )}
      </Box>

      <DetailsMain item={item} related={related} />
      <Footer />
    </Box>
  );
};

export default HomeDetails;
