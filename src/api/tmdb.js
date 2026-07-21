import axios from "axios";

/**
 * TMDB (The Movie Database) is the industry-standard free catalogue behind most
 * streaming-service clones: HD landscape backdrops, portrait posters, YouTube
 * trailers, cast and ratings. Apple has no public API, so TMDB is what lets this
 * clone look like the real Apple TV+ home screen with real, current titles.
 *
 * Get a free key at https://www.themoviedb.org/settings/api and drop it into a
 * `.env.local` file as `REACT_APP_TMDB_KEY=...` (see `.env.example`). Without a
 * key the app falls back to the bundled local catalogue, so it is never blank.
 */

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export const hasTmdbKey = Boolean(API_KEY);

const client = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: "en-US", include_adult: false },
  timeout: 12000,
});

/** Build a CDN image URL at a given render size, or null when the path is empty. */
const build = (size) => (path) => (path ? `${IMG_BASE}/${size}${path}` : null);

export const img = {
  // Landscape card art — Apple TV+ leads with 16:9 backdrops, not posters.
  card: build("w780"),
  // Full-bleed hero. w1280 keeps payload sane; the eye can't tell it from original.
  hero: build("w1280"),
  // Portrait poster, used where a taller shape reads better.
  poster: build("w500"),
  // Circular cast headshots.
  profile: build("w185"),
};

const get = async (path, params = {}) => {
  const { data } = await client.get(path, { params });
  return data;
};

const yearOf = (item) =>
  (item.release_date || item.first_air_date || "").slice(0, 4) || null;

/**
 * Collapse a raw TMDB result into the flat shape the UI already consumes. `type`
 * is the fallback media type for endpoints (discover, top_rated) whose results
 * omit `media_type`.
 */
const mapItem = (raw, type = "movie") => {
  const mediaType = raw.media_type === "tv" || raw.media_type === "movie" ? raw.media_type : type;
  const title = raw.title || raw.name || "Untitled";
  return {
    uid: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    mediaType,
    title,
    // `info` is what the card caption / details eyebrow reads.
    info: title,
    image: img.card(raw.backdrop_path) || img.poster(raw.poster_path),
    poster: img.poster(raw.poster_path),
    backdrop: img.hero(raw.backdrop_path),
    overview: raw.overview || "",
    year: yearOf(raw),
    rating: raw.vote_average ? Number(raw.vote_average).toFixed(1) : null,
  };
};

/** Keep only items that actually have artwork to show, then de-duplicate by id. */
const clean = (results = [], type) => {
  const seen = new Set();
  return results
    .filter((r) => r.backdrop_path || r.poster_path)
    .map((r) => mapItem(r, type))
    .filter((item) => {
      if (seen.has(item.uid)) return false;
      seen.add(item.uid);
      return true;
    });
};

// The rails, in the order Apple tends to present them. Each pulls a live TMDB
// endpoint; `type` seeds the media type where the endpoint doesn't return one.
const ROW_SOURCES = [
  { key: "trending", title: "Top Picks for You", path: "/trending/all/week" },
  {
    key: "apple-originals",
    title: "Apple TV+ Originals",
    // 2552 is Apple TV+'s network id on TMDB.
    path: "/discover/tv",
    params: { with_networks: 2552, sort_by: "popularity.desc" },
    type: "tv",
  },
  { key: "trending-movies", title: "Trending Movies", path: "/trending/movie/week", type: "movie" },
  { key: "top-tv", title: "Award-Winning Series", path: "/tv/top_rated", type: "tv" },
  { key: "popular-movies", title: "Blockbuster Movies", path: "/movie/popular", type: "movie" },
  {
    key: "scifi",
    title: "Sci-Fi & Fantasy",
    path: "/discover/tv",
    params: { with_genres: "10765", sort_by: "popularity.desc", "vote_count.gte": 300 },
    type: "tv",
  },
  { key: "top-movies", title: "Critically Acclaimed", path: "/movie/top_rated", type: "movie" },
  {
    key: "comedy",
    title: "Comedy Series",
    path: "/discover/tv",
    params: { with_genres: "35", sort_by: "popularity.desc", "vote_count.gte": 200 },
    type: "tv",
  },
  {
    key: "documentaries",
    title: "Nonfiction & Documentaries",
    path: "/discover/movie",
    params: { with_genres: "99", sort_by: "popularity.desc", "vote_count.gte": 100 },
    type: "movie",
  },
  {
    key: "kids",
    title: "Kids & Family",
    path: "/discover/movie",
    params: { with_genres: "10751", sort_by: "popularity.desc", "vote_count.gte": 200 },
    type: "movie",
  },
];

/**
 * Fetch every home rail plus the hero and featured strips in one parallel burst.
 * A single row failing (rate limit, network blip) drops that row rather than the
 * whole page.
 */
export const getHomeCatalog = async () => {
  const [trendingDay, ...rowResults] = await Promise.all([
    get("/trending/all/day").catch(() => null),
    ...ROW_SOURCES.map((src) =>
      get(src.path, src.params).then((d) => ({ src, data: d })).catch(() => null)
    ),
  ]);

  const rows = rowResults
    .filter(Boolean)
    .map(({ src, data }) => ({
      key: src.key,
      title: src.title,
      items: clean(data.results, src.type).slice(0, 18),
    }))
    .filter((row) => row.items.length >= 6);

  if (!rows.length) throw new Error("TMDB returned no usable rows");

  const trending = clean(trendingDay?.results, "movie");
  // The hero wants big, well-described titles; keep ones with real backdrops.
  const heroSlides = trending
    .filter((item) => item.backdrop && item.overview)
    .slice(0, 6);

  // A second visual break lower down — reuse trending art we're not showing above.
  const featured = trending.slice(6, 12).length
    ? trending.slice(6, 12)
    : trending.slice(0, 6);

  return { rows, heroSlides, featured };
};

/** Multi-search across movies and TV, artwork-bearing results only. */
export const searchTitles = async (query) => {
  if (!query.trim()) return [];
  const data = await get("/search/multi", { query, page: 1 });
  const results = (data.results || []).filter(
    (r) => r.media_type === "movie" || r.media_type === "tv"
  );
  return clean(results).slice(0, 24);
};

const pickTrailer = (videos = []) => {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0];
  return trailer?.key || null;
};

/** Full detail payload for one title: hero art, meta, trailer, cast, related. */
export const getTitleDetails = async (mediaType, id) => {
  const data = await get(`/${mediaType}/${id}`, {
    append_to_response: "videos,credits,recommendations,similar",
  });

  const related = clean(
    (data.recommendations?.results?.length
      ? data.recommendations.results
      : data.similar?.results) || [],
    mediaType
  ).slice(0, 14);

  return {
    uid: `${mediaType}-${id}`,
    mediaType,
    title: data.title || data.name,
    overview: data.overview || "",
    backdrop: img.hero(data.backdrop_path) || img.poster(data.poster_path),
    poster: img.poster(data.poster_path),
    year: yearOf(data),
    rating: data.vote_average ? Number(data.vote_average).toFixed(1) : null,
    genres: (data.genres || []).map((g) => g.name),
    runtime: data.runtime || null,
    seasons: data.number_of_seasons || null,
    episodes: data.number_of_episodes || null,
    tagline: data.tagline || "",
    trailerKey: pickTrailer(data.videos?.results),
    cast: (data.credits?.cast || []).slice(0, 12).map((person) => ({
      name: person.name,
      role: person.character,
      image: img.profile(person.profile_path),
    })),
    related,
  };
};

const tmdb = { getHomeCatalog, getTitleDetails, searchTitles, img, hasTmdbKey };
export default tmdb;
