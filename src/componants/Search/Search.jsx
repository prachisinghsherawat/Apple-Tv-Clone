import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { hasTmdbKey, searchTitles } from "../../api/tmdb";
import { rows as localRows } from "../Home/Data/catalog";
import { Footer } from "../Home/Footer/Footer";

// Flat list of every bundled title, used when there's no TMDB key to search.
const localIndex = localRows.flatMap((row) => row.items);

const searchLocal = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return localIndex
    .filter((item) => `${item.title || ""} ${item.info || ""}`.toLowerCase().includes(q))
    .slice(0, 24);
};

const ResultCard = ({ item, onOpen }) => (
  <Box
    as="button"
    onClick={() => onOpen(item)}
    textAlign="left"
    borderRadius="card"
    _focusVisible={{ outline: "2px solid", outlineColor: "brand.500", outlineOffset: "3px" }}
    sx={{ "&:hover .art": { transform: "scale(1.04)", boxShadow: "0 16px 40px rgba(0,0,0,0.7)" } }}
  >
    <Box
      className="art"
      borderRadius="card"
      overflow="hidden"
      bg="surface.raised"
      boxShadow="0 8px 24px rgba(0,0,0,0.5)"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
    >
      <Box as="img" src={item.image} alt={item.title} loading="lazy" width="100%" sx={{ aspectRatio: "16 / 9" }} objectFit="cover" display="block" />
    </Box>
    <Text mt={2} fontSize="sm" fontWeight="600" noOfLines={1}>
      {item.title}
    </Text>
    {item.year && (
      <Text fontSize="xs" color="content.muted">
        {item.year}
      </Text>
    )}
  </Box>
);

export const Search = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setParams({}, { replace: true });
      return undefined;
    }

    setLoading(true);
    // Debounce so we don't fire a request on every keystroke.
    debounceRef.current = setTimeout(async () => {
      setParams({ q: trimmed }, { replace: true });
      if (!hasTmdbKey) {
        setResults(searchLocal(trimmed));
        setLoading(false);
        return;
      }
      try {
        setResults(await searchTitles(trimmed));
      } catch {
        setResults(searchLocal(trimmed));
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [trimmed, setParams]);

  const open = (item) => item.uid && navigate(`/details/${item.uid}`);

  return (
    <Box as="main" bg="surface.canvas" minH="100vh">
      <Box px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 24, md: 28 }} pb={10}>
        <Heading fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800" mb={6}>
          Search
        </Heading>
        <InputGroup maxW="640px" size="lg">
          <InputLeftElement pointerEvents="none" h="100%">
            <BsSearch color="var(--chakra-colors-content-muted)" />
          </InputLeftElement>
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Movies, series, and more"
            borderRadius="full"
            fontSize="md"
          />
        </InputGroup>

        <Box mt={10} minH="40vh">
          {loading ? (
            <Flex justify="center" py={20}>
              <Spinner size="lg" color="brand.400" thickness="3px" />
            </Flex>
          ) : trimmed && results.length === 0 ? (
            <Text color="content.secondary" py={10}>
              No results for “{trimmed}”. Try another title.
            </Text>
          ) : results.length > 0 ? (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={{ base: 4, md: 6 }}>
              {results.map((item) => (
                <ResultCard key={item.uid} item={item} onOpen={open} />
              ))}
            </SimpleGrid>
          ) : (
            <Text color="content.muted" py={10}>
              Start typing to explore the catalogue.
            </Text>
          )}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Search;
