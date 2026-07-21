import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const SIZES = {
  poster: { base: "260px", md: "300px", lg: "336px" },
  episode: { base: "280px", md: "340px", lg: "384px" },
};

const MediaCard = ({ item, width, onOpen, showCaption }) => (
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
    _focusVisible={{
      outline: "2px solid",
      outlineColor: "brand.500",
      outlineOffset: "4px",
    }}
    // Hover/focus styling is driven from the card root via descendant selectors
    // rather than Chakra's `_groupHover`, which would need role="group" here and
    // collide with the button semantics this element already carries.
    sx={{
      "&:hover .media-art, &:focus-visible .media-art": {
        transform: "scale(1.045)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.72)",
      },
      "&:hover .media-scrim, &:focus-visible .media-scrim": { opacity: 1 },
    }}
  >
    <Box
      className="media-art"
      position="relative"
      overflow="hidden"
      borderRadius="card"
      bg="surface.raised"
      boxShadow="0 8px 24px rgba(0,0,0,0.5)"
      transition="transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.32s ease"
    >
      <Box
        as="img"
        src={item.image}
        alt={item.title || item.info || "Apple TV+ title artwork"}
        loading="lazy"
        display="block"
        width="100%"
        sx={{ aspectRatio: "16 / 9" }}
        objectFit="cover"
      />
      {/* Warms the artwork on hover without washing out the image itself. */}
      <Box
        className="media-scrim"
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, blackAlpha.700, transparent 55%)"
        opacity={0}
        transition="opacity 0.32s ease"
      />
    </Box>

    {showCaption && (item.title || item.episode || item.info) && (
      <Box pt={3}>
        {item.episode && (
          <Text
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.08em"
            color="content.muted"
            textTransform="uppercase"
          >
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
        {item.time && (
          <Text fontSize="xs" color="content.muted" mt={1}>
            {item.time}
          </Text>
        )}
        {!item.title && !item.description && item.info && (
          <Text fontSize="sm" color="content.secondary" noOfLines={1}>
            {item.info}
          </Text>
        )}
      </Box>
    )}
  </Box>
);

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
    // Hidden from assistive tech when off-screen; the rail itself is scrollable.
    tabIndex={visible ? 0 : -1}
  />
);

export const MediaRow = ({
  data = [],
  title,
  subtitle,
  variant = "poster",
  showCaption = false,
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
      // 8px of slack absorbs sub-pixel rounding at the end of the track.
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
    // Leave one card visible from the previous page for orientation.
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
          pb={4}
          overflowX="auto"
          scrollSnapType="x mandatory"
          // Without matching scroll-padding, snapping aligns the first card to
          // the container edge and eats the gutter, clipping it against the page.
          scrollPaddingLeft={{ base: 5, md: 10, lg: 16 }}
          sx={{
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {data.map((item, index) => (
            <MediaCard
              key={item.uid || index}
              item={item}
              width={SIZES[variant]}
              onOpen={handleOpen}
              showCaption={showCaption}
            />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default MediaRow;
