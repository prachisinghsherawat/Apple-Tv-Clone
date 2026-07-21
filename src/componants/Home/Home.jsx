import { Box } from "@chakra-ui/react";
import Banner from "./Banners/Banner";
import MiniBanner from "./MiniBanner/MiniBanner";
import MediaRow from "./MiniCard/MediaRow";
import { Footer } from "./Footer/Footer";
import { rows, featured } from "./Data/catalog";

// The featured strip breaks up the rails roughly a third of the way down.
const FEATURE_STRIP_AFTER = 4;

function Home() {
  return (
    <Box as="main" bg="surface.canvas">
      <Banner />

      <Box pb={16}>
        {rows.map((row, index) => (
          <Box key={row.key}>
            <MediaRow
              data={row.items}
              title={row.title}
              subtitle={row.subtitle}
              showCaption={row.key === "coming-soon"}
            />
            {index === FEATURE_STRIP_AFTER && <MiniBanner data={featured} />}
          </Box>
        ))}
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
