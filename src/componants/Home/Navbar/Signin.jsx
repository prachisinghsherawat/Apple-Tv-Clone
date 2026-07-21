import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { getusertoken } from "../../../Redux/Login/action";
import { DEMO_CREDENTIALS } from "../../../Redux/Login/mockAuth";
import AppleGlyph from "./AppleGlyph";

const init = { email: "", password: "" };

export const Signin = ({ isOpen, onClose, toggleAuthMode }) => {
  const [userlogin, setuserlogin] = useState(init);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserlogin((current) => ({ ...current, [name]: value }));
  };

  const handelsubmit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    dispatch(getusertoken(userlogin))
      .then(() => {
        setuserlogin(init);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const useDemo = () => {
    setuserlogin(DEMO_CREDENTIALS);
    setError("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
      <ModalContent bg="surface.raised" border="1px solid" borderColor="surface.border" borderRadius="2xl" pb={2}>
        <ModalCloseButton color="content.secondary" />
        <ModalBody as="form" onSubmit={handelsubmit} px={{ base: 6, md: 10 }} py={9}>
          <Stack spacing={6} align="center">
            <AppleGlyph />
            <Stack spacing={2} textAlign="center">
              <Heading size="md" fontWeight="700">
                Sign in with your Apple ID
              </Heading>
              <Text fontSize="sm" color="content.secondary">
                You will be signed in to Apple TV and Apple Music.
              </Text>
            </Stack>

            {error && (
              <Alert status="error" bg="red.900" color="red.100" borderRadius="lg" fontSize="sm" py={2}>
                <AlertIcon color="red.300" />
                {error}
              </Alert>
            )}

            <Stack spacing={3} width="100%">
              <FormControl isRequired>
                <Input
                  type="email"
                  name="email"
                  value={userlogin.email}
                  placeholder="Apple ID"
                  onChange={handleChange}
                  size="lg"
                  fontSize="md"
                  borderRadius="xl"
                />
              </FormControl>

              <FormControl isRequired>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={userlogin.password}
                    placeholder="Password"
                    onChange={handleChange}
                    fontSize="md"
                    borderRadius="xl"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      color="content.secondary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((current) => !current)}
                      _hover={{ bg: "whiteAlpha.100" }}
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                borderRadius="xl"
                isLoading={loading}
                loadingText="Signing in"
              >
                Sign In
              </Button>
            </Stack>

            <Divider borderColor="surface.border" />

            <Stack spacing={3} align="center" width="100%">
              <Button variant="link" size="sm" color="brand.300" onClick={useDemo}>
                Use demo account
              </Button>
              <Text fontSize="sm" color="content.secondary">
                Don't have an Apple ID?{" "}
                <Button variant="link" size="sm" color="brand.300" onClick={toggleAuthMode}>
                  Create yours now
                </Button>
              </Text>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Signin;
