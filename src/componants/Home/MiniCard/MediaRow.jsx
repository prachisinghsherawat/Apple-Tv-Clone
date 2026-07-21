import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, HStack, IconButton, Text } from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsCheck2, BsPlus, BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../../../context/WatchlistContext";

const SIZES = {
  poster: { base: "260px", md: "300px", lg: "336px" },
  episode: { base: "280px", md: "340px", lg: "384px" },
};

const MediaCard = ({ item, width, onOpen, showCaption, rank }) => {
  const { has, toggle } = useWatchlist();
  const saved = has(item.uid);

  const card = (
    <Box
      as="article"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item);
        }
      }}
      flex="0 0 auto"
      width={width}
      scrollSnapAlign="start"
      cursor="pointer"
      borderRadius="card"
      _focusVisible={{ outline: "2px solid", outlineColor: "brand.500", outlineOffset: "4px" }}
      sx={{
        "&:hover .media-art, &:focus-visible .media-art": {
          transform: "scale(1.05)",
          boxShadow: "0 22px 50px rgba(0,0,0,0.75)",
          borderColor: "whiteAlpha.300",
        },
        "&:hover .media-overlay, &:focus-visible .media-overlay": { opacity: 1 },
      }}
    >
      <Box
        className="media-art"
        position="relative"
        overflow="hidden"
        borderRadius="card"
        bg="surface.raised"
        border="1px solid"
        borderColor="surface.border"
        boxShadow="0 8px 24px rgba(0,0,0,0.5)"
        transition="transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.32s ease, border-color 0.32s ease"
      >
        <Box
          as="img"
          src={item.image}
          alt={item.title || item.info || "Title artwork"}
          loading="lazy"
          display="block"
          width="100%"
          sx={{ aspectRatio: "16 / 9" }}
          objectFit="cover"
          onError={(e) => {
            e.currentTarget.style.opacity = 0.25;
          }}
        />

        {/* Rating pill — always readable, sits top-left. */}
        {item.rating && item.rating !== "0.0" && (
          <HStack
            position="absolute"
            top={2}
            left={2}
            spacing={1}
            bg="blackAlpha.700"
            backdropFilter="blur(6px)"
            borderRadius="full"
            px={2}
            py="2px"
          >
            <BsStarFill size="9px" color="#f5c518" />
            <Text fontSize="xs" fontWeight="700" color="content.primary">
              {item.rating}
            </Text>
          </HStack>
        )}

        {/* Add / remove from Up Next — stops the click reaching the card. */}
        <IconButton
          aria-label={saved ? "Remove from Up Next" : "Add to Up Next"}
          icon={saved ? <BsCheck2 size="18px" /> : <BsPlus size="20px" />}
          onClick={(e) => {
            e.stopPropagation();
            toggle(item);
          }}
          position="absolute"
          top={1.5}
          right={1.5}
          size="sm"
          isRound
          minW="32px"
          h="32px"
          bg={saved ? "brand.500" : "blackAlpha.700"}
          color="white"
          backdropFilter="blur(6px)"
          _hover={{ bg: saved ? "brand.400" : "blackAlpha.800", transform: "scale(1.1)" }}
        />

        {/* Hover overlay: title + meta, fading up from the bottom. */}
        <Box
          className="media-overlay"
          position="absolute"
          inset={0}
          opacity={0}
          transition="opacity 0.28s ease"
          bgGradient="linear(to-t, blackAlpha.900 0%, blackAlpha.400 40%, transparent 70%)"
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          p={3}
        >
          <Text fontSize="sm" fontWeight="700" color="content.primary" noOfLines={1}>
            {item.title || item.info}
          </Text>
          <HStack spacing={2} mt={0.5} color="content.secondary" fontSize="xs">
            {item.year && <Text>{item.year}</Text>}
            {item.mediaType && (
              <Text textTransform="uppercase" letterSpacing="0.06em">
                {item.mediaType === "tv" ? "Series" : "Film"}
              </Text>
            )}
          </HStack>
        </Box>
      </Box>

      {showCaption && (item.title || item.episode || item.info) && (
        <Box pt={3}>
          {item.episode && (
            <Text fontSize="xs" fontWeight="700" letterSpacing="0.08em" color="content.muted" textTransform="uppercase">
              {item.episode}
            </Text>
          )}
          {item.title && (
            <Text fontSize="md" fontWeight="600" color="content.primary" noOfLines={1}>
              {item.title}
            </Text>
          )}
          {item.description && (
            <Text fontSize="sm" color="content.secondary" noOfLines={2} mt={1}>
              {item.description}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );

  if (!rank) return card;

  // Top 10 layout: an oversized outlined rank numeral tucked behind the artwork.
  return (
    <Flex flex="0 0 auto" align="flex-end" scrollSnapAlign="start">
      <Text
        aria-hidden
        fontWeight="900"
        lineHeight="0.8"
        fontSize={{ base: "96px", md: "128px" }}
        mr={{ base: "-14px", md: "-20px" }}
        color="transparent"
        sx={{ WebkitTextStroke: "2px rgba(255,255,255,0.45)" }}
        userSelect="none"
      >
        {rank}
      </Text>
      {card}
    </Flex>
  );
};

const ScrollButton = ({ side, onClick, visible }) => (
  <IconButton
    aria-label={side === "left" ? "Scroll left" : "Scroll right"}
    icon={side === "left" ? <BiChevronLeft size="30px" /> : <BiChevronRight size="30px" />}
    onClick={onClick}
    position="absolute"
    {...(side === "left" ? { left: 2 } : { right: 2 })}
    top="50%"
    transform="translateY(-50%)"
    zIndex={3}
    size="lg"
    isRound
    bg="rgba(28,28,30,0.82)"
    color="content.primary"
    backdropFilter="blur(16px)"
    border="1px solid"
    borderColor="surface.border"
    opacity={visible ? 1 : 0}
    pointerEvents={visible ? "auto" : "none"}
    transition="opacity 0.2s ease, transform 0.2s ease"
    _hover={{ bg: "rgba(44,44,46,0.95)", transform: "translateY(-50%) scale(1.08)" }}
    tabIndex={visible ? 0 : -1}
  />
);

export const MediaRow = ({
  data = [],
  title,
  subtitle,
  variant = "poster",
  showCaption = false,
  ranked = false,
  onSelect,
}) => {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const syncEdges = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    setEdges({
      start: scrollLeft <= 8,
      end: scrollLeft + clientWidth >= scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges, data]);

  const scrollByPage = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  };

  const handleOpen = (item) => {
    if (onSelect) return onSelect(item);
    if (item.uid) navigate(`/details/${item.uid}`);
  };

  if (!data.length) return null;

  return (
    <Box
      as="section"
      aria-label={title}
      pt={{ base: 8, md: 12 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(title || subtitle) && (
        <Box px={{ base: 5, md: 10, lg: 16 }} pb={4}>
          {title && (
            <Heading as="h2" fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="700">
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text mt={1} fontSize={{ base: "sm", md: "md" }} color="content.secondary">
              {subtitle}
            </Text>
          )}
        </Box>
      )}

      <Box position="relative">
        <ScrollButton side="left" onClick={() => scrollByPage(-1)} visible={hovered && !edges.start} />
        <ScrollButton side="right" onClick={() => scrollByPage(1)} visible={hovered && !edges.end} />

        <Flex
          ref={scrollerRef}
          onScroll={syncEdges}
          gap={{ base: 3, md: 4 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={2}
          pb={4}
          overflowX="auto"
          scrollSnapType="x mandatory"
          scrollPaddingLeft={{ base: 5, md: 10, lg: 16 }}
          sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          {data.map((item, index) => (
            <MediaCard
              key={item.uid || index}
              item={item}
              width={SIZES[variant]}
              onOpen={handleOpen}
              showCaption={showCaption}
              rank={ranked ? index + 1 : undefined}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default MediaRow;
