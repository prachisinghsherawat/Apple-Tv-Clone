import {
  comingSoon,
  tales,
  mysteries,
  voice,
  extraOrd,
  creatures,
  jumboSliderData,
  dramaSeries,
  severWN,
  featurefilms,
  comSeries,
  amazPlanet,
  nonFi,
  kidsFam,
} from "./Data";

/**
 * The raw collections in Data.jsx number their `id` fields per-collection, so
 * `comingSoon` and `tales` both contain an item with id 1 — and most items have
 * no id at all. Routing on those ids sent almost every card to a blank details
 * page. This module is the single place that normalises the catalogue: every
 * title gets a stable, globally unique `uid` derived from its row and position,
 * so lookups can never collide and can never be undefined.
 */

const ROW_DEFINITIONS = [
  {
    key: "coming-soon",
    title: "Coming Soon",
    subtitle: "Add to your Up Next watchlist today.",
    items: comingSoon,
  },
  { key: "eerie-tales", title: "Eerie Tales", items: tales },
  { key: "mysteries", title: "Mysteries & Whodunits", items: mysteries },
  { key: "voice", title: "Finding Their Voice", items: voice },
  { key: "extraordinary", title: "Extraordinary People", items: extraOrd },
  { key: "creatures", title: "Creatures & Critters", items: creatures },
  { key: "drama", title: "All Drama Series", items: dramaSeries },
  {
    key: "severance",
    title: "Severance: Watch Now",
    subtitle:
      "Adam Scott stars in a darkly thrilling new series from Ben Stiller.",
    items: severWN,
  },
  { key: "feature-films", title: "Feature Films", items: featurefilms },
  { key: "comedy", title: "All Comedy Series", items: comSeries },
  {
    key: "planet",
    title: "Our Amazing Planet",
    subtitle: "Explore nature documentary films and series.",
    items: amazPlanet,
  },
  { key: "nonfiction", title: "All Nonfiction Series", items: nonFi },
  {
    key: "kids",
    title: "Kids and Family",
    subtitle: "Discover shows and movies filled with wonder and imagination.",
    items: kidsFam,
  },
];

// Several image URLs in Data.jsx carry stray leading/trailing whitespace, which
// breaks them as `src` values in some browsers.
const clean = (url) => (typeof url === "string" ? url.trim() : url);

const normaliseItem = (item, row, index) => ({
  ...item,
  uid: `${row.key}-${index}`,
  image: clean(item.image),
  rowKey: row.key,
  rowTitle: row.title,
  // `info` is the only human-readable label the source data carries; where it is
  // absent the artwork itself carries the title, exactly as it does on Apple TV+.
  info: item.info || "",
});

export const rows = ROW_DEFINITIONS.map((row) => ({
  key: row.key,
  title: row.title,
  subtitle: row.subtitle,
  items: row.items.map((item, index) => normaliseItem(item, row, index)),
}));

/** Flat index of every title in the catalogue, keyed by uid. */
const byUid = new Map(
  rows.flatMap((row) => row.items.map((item) => [item.uid, item]))
);

export const findByUid = (uid) => byUid.get(uid);

/**
 * Titles from the same row, minus the one being viewed — the "More Like This"
 * rail. Falls back to a spread across the catalogue for single-item rows.
 */
export const relatedTo = (uid, limit = 12) => {
  const item = byUid.get(uid);
  if (!item) return [];

  const sameRow = (rows.find((row) => row.key === item.rowKey)?.items || [])
    .filter((candidate) => candidate.uid !== uid)
    .slice(0, limit);

  if (sameRow.length >= 4) return sameRow;

  const fill = [...byUid.values()]
    .filter(
      (candidate) =>
        candidate.uid !== uid &&
        !sameRow.some((existing) => existing.uid === candidate.uid)
    )
    .slice(0, limit - sameRow.length);

  return [...sameRow, ...fill];
};

/** Only some titles ship with a bundled video; the rest fall back to artwork. */
export const hasVideo = (item) => Boolean(item && item.video);

export const featured = jumboSliderData.map((item, index) => ({
  ...item,
  uid: `featured-${index}`,
  image: clean(item.image),
}));

export default rows;
