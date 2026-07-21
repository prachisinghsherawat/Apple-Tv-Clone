import { Box, Divider, Flex, Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import TvLogo from "../Images/TV App Logo.png";
import AppleTvDevice from "../Images/product_landing 1.png";
import IPhone from "../Images/product_landing 2.png";
import IPad from "../Images/product_landing 3.png";
import Mac from "../Images/product_landing 4.png";
import Airplay from "../Images/product_landing 5.png";
import Banner1 from "../Images/banner 1.png";
import Banner2 from "../Images/banner 2.png";
import Banner3 from "../Images/banner 3.png";

const SECTION_X = { base: 5, md: 10, lg: 16 };

const DEVICES = [
  { src: AppleTvDevice, label: "Apple TV" },
  { src: IPhone, label: "iPhone" },
  { src: IPad, label: "iPad" },
  { src: Mac, label: "Mac" },
  { src: Airplay, label: "AirPlay" },
];

const PLATFORMS = [
  { src: Banner1, label: "Streaming Devices", items: ["Roku", "Fire TV", "Google TV", "Android TV"] },
  { src: Banner2, label: "Smart TVs", items: ["Samsung", "LG", "VIZIO", "Sony"] },
  { src: Banner3, label: "Gaming Consoles", items: ["PlayStation", "Xbox"] },
];

const LEGAL = [
  "Internet Service Terms",
  "Apple TV & Privacy",
  "Cookie Warning",
  "Support",
];

export const Footer = () => (
  <Box as="footer" bg="surface.canvas" borderTop="1px solid" borderColor="surface.border">
    <Box px={SECTION_X} py={{ base: 14, md: 20 }}>
      <Stack spacing={4} align="center" textAlign="center" maxW="640px" mx="auto">
        <Box as="img" src={TvLogo} alt="Apple TV app" height="52px" objectFit="contain" />
        <Heading as="h2" fontSize={{ base: "xl", md: "3xl" }} fontWeight="700">
          Watch Apple TV+ here or anywhere.
        </Heading>
        <Text fontSize={{ base: "sm", md: "md" }} color="content.secondary">
          Find Apple TV+ on the Apple TV app, available on Apple devices, smart TVs, and more.
        </Text>
        <Link
          href="https://support.apple.com/en-in/guide/tvplus/welcome/web"
          isExternal
          color="brand.300"
          fontSize="sm"
          fontWeight="500"
          _hover={{ textDecoration: "underline" }}
        >
          See all supported devices →
        </Link>
      </Stack>

      <SimpleGrid columns={{ base: 3, md: 5 }} spacing={{ base: 6, md: 10 }} mt={{ base: 12, md: 16 }}>
        {DEVICES.map((device) => (
          <Stack key={device.label} spacing={3} align="center">
            <Box
              as="img"
              src={device.src}
              alt={device.label}
              loading="lazy"
              height={{ base: "56px", md: "76px" }}
              objectFit="contain"
              opacity={0.9}
              transition="opacity 0.25s ease, transform 0.25s ease"
              _hover={{ opacity: 1, transform: "translateY(-4px)" }}
            />
            <Text fontSize="sm" color="content.secondary">
              {device.label}
            </Text>
          </Stack>
        ))}
      </SimpleGrid>
    </Box>

    <Box px={SECTION_X}>
      <Divider borderColor="surface.border" />
    </Box>

    <Box px={SECTION_X} py={{ base: 12, md: 16 }}>
      <Stack spacing={3} align="center" textAlign="center" mb={{ base: 10, md: 14 }}>
        <Heading as="h2" fontSize={{ base: "lg", md: "2xl" }} fontWeight="700">
          See it on your big screen.
        </Heading>
        <Link
          href="https://www.apple.com/apple-tv-app/devices/"
          isExternal
          color="brand.300"
          fontSize="sm"
          fontWeight="500"
          _hover={{ textDecoration: "underline" }}
        >
          Explore compatible devices →
        </Link>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 8, md: 10 }}>
        {PLATFORMS.map((platform) => (
          <Stack
            key={platform.label}
            spacing={4}
            p={6}
            borderRadius="2xl"
            bg="surface.raised"
            border="1px solid"
            borderColor="surface.border"
            transition="transform 0.25s ease, border-color 0.25s ease"
            _hover={{ transform: "translateY(-4px)", borderColor: "whiteAlpha.400" }}
          >
            <Box
              as="img"
              src={platform.src}
              alt={platform.label}
              loading="lazy"
              height="64px"
              objectFit="contain"
              alignSelf="flex-start"
            />
            <Text fontWeight="600">{platform.label}</Text>
            <Stack spacing={1}>
              {platform.items.map((entry) => (
                <Text key={entry} fontSize="sm" color="content.secondary">
                  {entry}
                </Text>
              ))}
            </Stack>
          </Stack>
        ))}
      </SimpleGrid>

      <Text fontSize="xs" color="content.muted" textAlign="center" mt={10}>
        Device availability varies by country or region.
      </Text>
    </Box>

    <Box px={SECTION_X}>
      <Divider borderColor="surface.border" />
    </Box>

    <Flex
      px={SECTION_X}
      py={7}
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      gap={4}
    >
      <Stack spacing={3} direction={{ base: "column", md: "row" }} align={{ md: "center" }}>
        <Text fontSize="xs" color="content.muted">
          Copyright © {new Date().getFullYear()} Apple Inc. All rights reserved.
        </Text>
        <Flex gap={4} wrap="wrap">
          {LEGAL.map((entry) => (
            <Text
              key={entry}
              fontSize="xs"
              color="content.secondary"
              cursor="pointer"
              _hover={{ color: "content.primary", textDecoration: "underline" }}
            >
              {entry}
            </Text>
          ))}
        </Flex>
      </Stack>
      <Text fontSize="xs" color="content.muted">
        United States
      </Text>
    </Flex>
  </Box>
);

export default Footer;
