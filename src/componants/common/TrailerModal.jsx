import React from "react";
import {
  AspectRatio,
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

/**
 * Plays a title's YouTube trailer in a cinematic overlay. The iframe only mounts
 * while the modal is open, so nothing streams (or autoplays audio) in the
 * background once it's closed.
 */
export const TrailerModal = ({ isOpen, onClose, trailerKey, videoSrc, title }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size={{ base: "full", md: "4xl" }}>
    <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
    <ModalContent bg="black" borderRadius={{ base: 0, md: "2xl" }} overflow="hidden" mx={{ md: 4 }}>
      <ModalCloseButton
        zIndex={2}
        color="white"
        bg="blackAlpha.600"
        borderRadius="full"
        _hover={{ bg: "blackAlpha.800" }}
      />
      <ModalBody p={0}>
        {isOpen && trailerKey ? (
          <AspectRatio ratio={16 / 9}>
            <Box
              as="iframe"
              title={`${title || "Title"} — Trailer`}
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              border="0"
            />
          </AspectRatio>
        ) : isOpen && videoSrc ? (
          <AspectRatio ratio={16 / 9}>
            <Box as="video" src={videoSrc} controls autoPlay playsInline bg="black" />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={16 / 9}>
            <Box display="grid" placeItems="center">
              <Text color="content.secondary">No trailer available for this title.</Text>
            </Box>
          </AspectRatio>
        )}
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default TrailerModal;
