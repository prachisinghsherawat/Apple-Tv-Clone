import { Box, Divider, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import MediaRow from "../Home/MiniCard/MediaRow";
import { CastData, SeasonData } from "../Home/Data/DetailsData";
import { DetailsFooter } from "./DetailsFooter";

const SECTION_X = { base: 5, md: 10, lg: 16 };

const episodes = SeasonData.map((episode, index) => ({
  ...episode,
  uid: `episode-${index}`,
  image: episode.image?.trim(),
}));

export const DetailsMain = ({ item, related = [] }) => (
  <Box>
    <MediaRow
      data={episodes}
      title="Season 1"
      subtitle="Every episode, ready to stream."
      variant="episode"
      showCaption
      // Episodes are not routable catalogue entries, so clicking is a no-op.
      onSelect={() => {}}
    />

    <Box px={SECTION_X} pt={{ base: 8, md: 12 }}>
      <Divider borderColor="surface.border" />
    </Box>

    <Box px={SECTION_X} pt={{ base: 8, md: 12 }}>
      <Heading as="h2" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="700" mb={5}>
        Trailer
      </Heading>
      <Box
        borderRadius="2xl"
        overflow="hidden"
        maxW="880px"
        boxShadow="0 18px 50px rgba(0,0,0,0.6)"
      >
        <Box
          as="img"
          src={item?.image}
          alt={`${item?.title || "Title"} trailer thumbnail`}
          loading="lazy"
          width="100%"
          display="block"
          sx={{ aspectRatio: "16 / 9" }}
          objectFit="cover"
        />
      </Box>
    </Box>

    <Box px={SECTION_X} pt={{ base: 10, md: 14 }}>
      <Heading as="h2" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="700" mb={6}>
        Cast & Crew
      </Heading>
      <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={{ base: 4, md: 6 }}>
        {/* Names are not unique in the source data, so index keys the list. */}
        {CastData.map((person, index) => (
          <Stack key={`${person.name}-${index}`} spacing={3} align="center" textAlign="center">
            <Box
              as="img"
              src={person.image?.trim()}
              alt={person.name}
              loading="lazy"
              boxSize={{ base: "72px", md: "96px" }}
              borderRadius="full"
              objectFit="cover"
              border="1px solid"
              borderColor="surface.border"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.06)" }}
            />
            <Box>
              <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                {person.name}
              </Text>
              <Text fontSize="xs" color="content.muted" noOfLines={1}>
                {person.role}
              </Text>
            </Box>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>

    <Box pt={{ base: 4, md: 8 }}>
      <MediaRow data={related} title="More Like This" />
    </Box>

    <Flex px={SECTION_X} pt={{ base: 10, md: 14 }}>
      <Divider borderColor="surface.border" />
    </Flex>

    <DetailsFooter />
  </Box>
);

export default DetailsMain;
