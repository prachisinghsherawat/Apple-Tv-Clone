import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPerson, BsSearch } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Signin } from "./Signin";
import { Signup } from "./Signup";
import { logout } from "../../../Redux/Login/action";
import AppleTvLogo from "./AppleTvLogo";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Originals", to: "/" },
  { label: "Movies", to: "/" },
  { label: "Kids", to: "/" },
];

function Navbar() {
  const authModal = useDisclosure();
  const mobileNav = useDisclosure();
  const [showSignup, setShowSignup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cancelRef = React.useRef();
  const dispatch = useDispatch();
  const location = useLocation();

  // Read the token from the store so the bar re-renders on sign in/out. The
  // previous version read localStorage during render, so it never updated.
  const token = useSelector((state) => state.login?.token);
  const user = useSelector((state) => state.login?.user);

  // The bar floats transparently over the hero and gains a blurred backdrop
  // only once content has scrolled beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleAuthMode = () => setShowSignup((current) => !current);

  const openAuth = (signup) => {
    setShowSignup(signup);
    authModal.onOpen();
  };

  const solid = scrolled || location.pathname !== "/";

  return (
    <>
      <Flex
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={100}
        align="center"
        height={{ base: "56px", md: "64px" }}
        px={{ base: 4, md: 10, lg: 16 }}
        bg={solid ? "rgba(0,0,0,0.72)" : "transparent"}
        backdropFilter={solid ? "blur(20px) saturate(180%)" : "none"}
        borderBottom="1px solid"
        borderColor={solid ? "surface.border" : "transparent"}
        transition="background 0.3s ease, border-color 0.3s ease"
      >
        <IconButton
          aria-label="Open menu"
          icon={<HiMenu size="22px" />}
          onClick={mobileNav.onOpen}
          variant="ghost"
          color="content.primary"
          display={{ base: "inline-flex", md: "none" }}
          mr={2}
          _hover={{ bg: "whiteAlpha.200" }}
        />

        <RouterLink to="/" aria-label="Apple TV+ home">
          <AppleTvLogo />
        </RouterLink>

        <HStack spacing={7} ml={10} display={{ base: "none", md: "flex" }}>
          {NAV_LINKS.map((link) => (
            <Text
              as={RouterLink}
              key={link.label}
              to={link.to}
              fontSize="sm"
              fontWeight="500"
              color="content.secondary"
              transition="color 0.2s ease"
              _hover={{ color: "content.primary" }}
            >
              {link.label}
            </Text>
          ))}
        </HStack>

        <Spacer />

        <HStack spacing={{ base: 1, md: 3 }}>
          <IconButton
            aria-label="Search"
            icon={<BsSearch size="17px" />}
            variant="ghost"
            color="content.secondary"
            _hover={{ bg: "whiteAlpha.200", color: "content.primary" }}
          />

          {token ? (
            <Menu placement="bottom-end">
              <MenuButton
                as={Box}
                cursor="pointer"
                borderRadius="full"
                _hover={{ opacity: 0.85 }}
              >
                <Avatar
                  size="sm"
                  name={user?.name}
                  bg="brand.500"
                  color="white"
                />
              </MenuButton>
              <MenuList
                bg="surface.overlay"
                borderColor="surface.border"
                minW="200px"
                py={2}
              >
                <Box px={3} pb={2}>
                  <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                    {user?.name || "Your Account"}
                  </Text>
                  <Text fontSize="xs" color="content.muted" noOfLines={1}>
                    {user?.email}
                  </Text>
                </Box>
                <MenuDivider borderColor="surface.border" />
                <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} fontSize="sm">
                  Up Next
                </MenuItem>
                <MenuItem bg="transparent" _hover={{ bg: "whiteAlpha.100" }} fontSize="sm">
                  Settings
                </MenuItem>
                <MenuDivider borderColor="surface.border" />
                <MenuItem
                  onClick={() => dispatch(logout())}
                  bg="transparent"
                  _hover={{ bg: "whiteAlpha.100" }}
                  fontSize="sm"
                  color="red.300"
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              size="sm"
              variant={solid ? "hero" : "glass"}
              leftIcon={<BsPerson size="16px" />}
              onClick={() => openAuth(false)}
              px={5}
            >
              Sign In
            </Button>
          )}
        </HStack>
      </Flex>

      <Drawer isOpen={mobileNav.isOpen} placement="left" onClose={mobileNav.onClose}>
        <DrawerOverlay bg="blackAlpha.700" />
        <DrawerContent bg="surface.raised" maxW="280px">
          <DrawerBody pt={5}>
            <Flex justify="space-between" align="center" mb={8}>
              <AppleTvLogo />
              <IconButton
                aria-label="Close menu"
                icon={<HiX size="22px" />}
                onClick={mobileNav.onClose}
                variant="ghost"
                color="content.primary"
                _hover={{ bg: "whiteAlpha.200" }}
              />
            </Flex>
            <Stack spacing={1}>
              {NAV_LINKS.map((link) => (
                <Text
                  as={RouterLink}
                  key={link.label}
                  to={link.to}
                  onClick={mobileNav.onClose}
                  py={3}
                  px={3}
                  borderRadius="lg"
                  fontSize="md"
                  fontWeight="500"
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  {link.label}
                </Text>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {showSignup ? (
        <Signup
          isOpen={authModal.isOpen}
          onClose={authModal.onClose}
          cancelRef={cancelRef}
          toggleAuthMode={toggleAuthMode}
        />
      ) : (
        <Signin
          isOpen={authModal.isOpen}
          onClose={authModal.onClose}
          cancelRef={cancelRef}
          toggleAuthMode={toggleAuthMode}
        />
      )}
    </>
  );
}

export default Navbar;
