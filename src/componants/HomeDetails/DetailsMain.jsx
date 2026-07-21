import { Box, Divider, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import MediaRow from "../Home/MiniCard/MediaRow";
import { DetailsFooter } from "./DetailsFooter";

const SECTION_X = { base: 5, md: 10, lg: 16 };

// A neutral avatar for cast members TMDB has no headshot for.
const FALLBACK_FACE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' fill='%231c1c1e'/><circle cx='48' cy='38' r='18' fill='%233a3a3c'/><path d='M16 92c0-18 14-30 32-30s32 12 32 30' fill='%233a3a3c'/></svg>"
  );

export const DetailsMain = ({ details }) => {
  const cast = details?.cast?.filter((p) => p.name) || [];
  const related = details?.related || [];

  return (
    <Box>
      {cast.length > 0 && (
        <Box px={SECTION_X} pt={{ base: 10, md: 14 }}>
          <Heading as="h2" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="700" mb={6}>
            Cast & Crew
          </Heading>
          <SimpleGrid columns={{ base: 3, sm: 4, md: 6 }} spacing={{ base: 4, md: 6 }}>
            {cast.map((person, index) => (
              <Stack key={`${person.name}-${index}`} spacing={3} align="center" textAlign="center">
                <Box
                  as="img"
                  src={person.image || FALLBACK_FACE}
                  alt={person.name}
                  loading="lazy"
                  boxSize={{ base: "72px", md: "96px" }}
                  borderRadius="full"
                  objectFit="cover"
                  bg="surface.overlay"
                  border="1px solid"
                  borderColor="surface.border"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.06)" }}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_FACE;
                  }}
                />
                <Box>
                  <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                    {person.name}
                  </Text>
                  {person.role && (
                    <Text fontSize="xs" color="content.muted" noOfLines={1}>
                      {person.role}
                    </Text>
                  )}
                </Box>
              </Stack>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {related.length > 0 && (
        <Box pt={{ base: 6, md: 10 }}>
          <MediaRow data={related} title="More Like This" />
        </Box>
      )}

      <Box px={SECTION_X} pt={{ base: 10, md: 14 }}>
        <Divider borderColor="surface.border" />
      </Box>

      <DetailsFooter />
    </Box>
  );
};

export default DetailsMain;
