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
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdOutlineEmail } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { registernuser } from "../../../Redux/Registration/action";
import AppleGlyph from "./AppleGlyph";

const initState = { name: "", email: "", password: "" };

export const Signup = ({ isOpen, onClose, toggleAuthMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setuser] = useState(initState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuser((current) => ({ ...current, [name]: value }));
  };

  const handelsubmit = (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    dispatch(registernuser(user))
      .then(() => {
        setuser(initState);
        onClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
                Create your Apple ID
              </Heading>
              <Text fontSize="sm" color="content.secondary">
                One Apple ID is all you need across all Apple services.
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
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" color="content.muted">
                    <FaUserAlt size="14px" />
                  </InputLeftElement>
                  <Input
                    name="name"
                    value={user.name}
                    placeholder="Full name"
                    onChange={handleChange}
                    fontSize="md"
                    borderRadius="xl"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" color="content.muted">
                    <MdOutlineEmail size="18px" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    placeholder="Email address"
                    onChange={handleChange}
                    fontSize="md"
                    borderRadius="xl"
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    placeholder="Password (min. 6 characters)"
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
                loadingText="Creating"
              >
                Create Apple ID
              </Button>
            </Stack>

            <Divider borderColor="surface.border" />

            <Text fontSize="sm" color="content.secondary">
              Already have an Apple ID?{" "}
              <Button variant="link" size="sm" color="brand.300" onClick={toggleAuthMode}>
                Sign in
              </Button>
            </Text>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Signup;
