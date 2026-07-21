import React from "react";
import { Box, Button, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { BsPlus, BsX } from "react-icons/bs";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import { Footer } from "../Home/Footer/Footer";

const Tile = ({ item, onOpen, onRemove }) => (
  <Box
    role="button"
    tabIndex={0}
    onClick={() => onOpen(item)}
    cursor="pointer"
    borderRadius="card"
    _focusVisible={{ outline: "2px solid", outlineColor: "brand.500", outlineOffset: "3px" }}
    sx={{
      "&:hover .art": { transform: "scale(1.04)", boxShadow: "0 16px 40px rgba(0,0,0,0.7)" },
      "&:hover .remove": { opacity: 1 },
    }}
  >
    <Box
      className="art"
      position="relative"
      borderRadius="card"
      overflow="hidden"
      bg="surface.raised"
      border="1px solid"
      borderColor="surface.border"
      boxShadow="0 8px 24px rgba(0,0,0,0.5)"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
    >
      <Box as="img" src={item.image} alt={item.title} loading="lazy" width="100%" sx={{ aspectRatio: "16 / 9" }} objectFit="cover" display="block" />
      <Box
        className="remove"
        as="button"
        aria-label={`Remove ${item.title} from Up Next`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.uid);
        }}
        position="absolute"
        top={2}
        right={2}
        display="grid"
        placeItems="center"
        boxSize="30px"
        borderRadius="full"
        bg="blackAlpha.800"
        color="white"
        opacity={{ base: 1, md: 0 }}
        transition="opacity 0.2s ease, background 0.2s ease"
        _hover={{ bg: "red.500" }}
      >
        <BsX size="20px" />
      </Box>
    </Box>
    <Text mt={2} fontSize="sm" fontWeight="600" noOfLines={1}>
      {item.title}
    </Text>
  </Box>
);

export const MyList = () => {
  const navigate = useNavigate();
  const { list, remove } = useWatchlist();

  return (
    <Box as="main" bg="surface.canvas" minH="100vh">
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 24, md: 28 }} pb={10}>
        <Heading fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800">
          Up Next
        </Heading>
        <Text mt={2} color="content.secondary">
          {list.length ? `${list.length} title${list.length > 1 ? "s" : ""} saved to watch.` : "Your watchlist is empty."}
        </Text>

        {list.length > 0 ? (
          <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={{ base: 4, md: 6 }} mt={8}>
            {list.map((item) => (
              <Tile key={item.uid} item={item} onOpen={(i) => navigate(`/details/${i.uid}`)} onRemove={remove} />
            ))}
          </SimpleGrid>
        ) : (
          <Flex direction="column" align="flex-start" gap={5} mt={12}>
            <Text color="content.muted" maxW="440px">
              Add films and series with the <BsPlus style={{ display: "inline" }} /> button on any title and they'll show up here.
            </Text>
            <Button as={RouterLink} to="/" variant="hero" size="lg">
              Browse Titles
            </Button>
          </Flex>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default MyList;
