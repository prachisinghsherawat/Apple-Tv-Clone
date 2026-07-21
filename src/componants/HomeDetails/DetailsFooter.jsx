import { Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";

const SECTION_X = { base: 5, md: 10, lg: 16 };

const INFORMATION = [
  ["Genre", "Thriller"],
  ["Released", "2022"],
  ["Rated", "TV-MA"],
  ["Region of Origin", "United States"],
  ["Original Audio", "English"],
];

const LANGUAGES = [
  ["Audio", "English (AD, AAC, Dolby Atmos, Dolby 5.1), and 9 more"],
  ["Subtitles", "English (CC, SDH), and 40 more"],
];

const ACCESSIBILITY = [
  ["CC", "Closed captions refer to subtitles in the available language with the addition of relevant non-dialogue information."],
  ["AD", "Audio descriptions refer to a narration track describing what is happening on screen, for those who are blind or have low vision."],
];

const Column = ({ heading, children }) => (
  <Stack spacing={4}>
    <Heading as="h3" fontSize="sm" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="content.primary">
      {heading}
    </Heading>
    {children}
  </Stack>
);

const Pair = ({ label, value }) => (
  <Box>
    <Text fontSize="xs" color="content.muted">
      {label}
    </Text>
    <Text fontSize="sm" color="content.secondary">
      {value}
    </Text>
  </Box>
);

export const DetailsFooter = () => (
  <Box as="section" px={SECTION_X} py={{ base: 10, md: 14 }}>
    <Heading as="h2" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="700" mb={7}>
      About
    </Heading>

    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 12 }}>
      <Column heading="Information">
        <Stack spacing={3}>
          {INFORMATION.map(([label, value]) => (
            <Pair key={label} label={label} value={value} />
          ))}
        </Stack>
      </Column>

      <Column heading="Languages">
        <Stack spacing={3}>
          {LANGUAGES.map(([label, value]) => (
            <Pair key={label} label={label} value={value} />
          ))}
        </Stack>
      </Column>

      <Column heading="Accessibility">
        <Stack spacing={4}>
          {ACCESSIBILITY.map(([badge, copy]) => (
            <Box key={badge}>
              <Box
                display="inline-block"
                px={1.5}
                py={0.5}
                mb={1}
                borderRadius="sm"
                border="1px solid"
                borderColor="surface.border"
                fontSize="xs"
                fontWeight="700"
                color="content.primary"
              >
                {badge}
              </Box>
              <Text fontSize="sm" color="content.secondary">
                {copy}
              </Text>
            </Box>
          ))}
        </Stack>
      </Column>
    </SimpleGrid>
  </Box>
);

export default DetailsFooter;
