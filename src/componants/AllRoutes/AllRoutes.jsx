import { Route, Routes, Link as RouterLink } from "react-router-dom";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import Home from "../Home/Home";
import { HomeDetails } from "../HomeDetails/HomeDetails";

const NotFound = () => (
  <Flex minH="100vh" align="center" justify="center" direction="column" gap={5} px={6}>
    <Heading size="2xl" fontWeight="800">
      404
    </Heading>
    <Text color="content.secondary" textAlign="center">
      This page isn't streaming anywhere right now.
    </Text>
    <Button as={RouterLink} to="/" variant="hero" size="lg">
      Back to Home
    </Button>
  </Flex>
);

export const AllRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/details/:id" element={<HomeDetails />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AllRoutes;
