import {
  Box,
  Grid,
  GridItem,
  Logo,
} from "@nypl/design-system-react-components";
import bwipjs from "bwip-js";
import Image from "next/image";
import { useEffect } from "react";
import { FormResults } from "../../interfaces";
import useFormDataContext from "../../context/FormDataContext";
import { useTranslation } from "next-i18next";

const styles = {
  outerBox: {
    mb: "l",
    bg: "var(--nypl-colors-ui-gray-light-cool)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  imageLion: {
    position: "relative",
    fontSize: "1em",
    mx: "0 auto",
    width: { base: "100%", md: "80%", lg: "60%" },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backgroundLion: {
    top: "6",
    width: "100%",
    position: "absolute",
    height: "100%",
    p: "0 2em 0 1.25em",
    display: "grid",
    gap: "0.5em 0.25em",
    gridTemplateColumns: "58% 30%",
    gridTemplateRows: "1fr 1fr 1fr",
    justifyContent: "center",
    alignItems: "center",
  },
  expiresText: {
    color: "white",
    fontSize: "clamp(0.6rem, 0.6rem + 0.2vw, 1rem)",
    mb: "s",
    gridColumn: "2",
    gridRow: "1",
  },
  logoItem: {
    color: "white",
    fontSize: "0.6em",
    mt: "1em",
    gridColumn: "1",
    gridRow: "1",
  },
  barcodeContainer: {
    bg: "white",
    p: "0.75em 1em 0em",
    display: "inline-block",
    gridColumn: "1 / 3",
    gridRow: "2",
    borderRadius: "5px",
  },
  memberName: {
    color: "white",
    fontSize: "clamp(0.8rem, 0.8rem + 0.4vw, 1rem)",
    lineHeight: 1.1,
    gridColumn: "1 / 3",
    gridRow: "3",
  },
};

const ConfirmationContainer = () => {
  const { state } = useFormDataContext();
  const formResults: FormResults = state.results;
  const { barcode, name, expirationDate } = formResults;
  const { t } = useTranslation("common");
  const canvasArgs = {
    role: "img",
    ["aria-label"]: `${t("ariaLabel.barcode")}`,
  };
  let canvas;
  // What we want to do is render the HTML and then pick up the canvas element.
  // We can then draw a barcode on it using `bwipjs`. The ILS uses `Codabar` as
  // its barcode type which is `rationalizedCodabar` in the bwip library.
  useEffect(() => {
    if (barcode && typeof document !== "undefined") {
      canvas = document.getElementById("barcodeCanvas") as HTMLCanvasElement;
      try {
        bwipjs.toCanvas(canvas, {
          // ILS Barcode type
          bcid: "rationalizedCodabar",
          text: `A${barcode}B`,
          scale: 2,
          height: 14, // Bar height, in millimeters
          // We'll render the barcode ourselves since we don't want the
          // "A" or "B" characters to show.
          includetext: false,
        });
      } catch (e) {
        console.log(`Could not render a barcode image: ${e}`);
      }
    }
  }, [canvas]);

  return (
    <Box className="card-container" sx={styles.outerBox}>
      <Box className="image-lion" sx={styles.imageLion}>
        <Image
          alt="NYPL Library Barcode Background"
          height="727"
          src="/library-card/cardbg.png"
          width="939"
        />
        <Grid className="background-lion" sx={styles.backgroundLion}>
          <GridItem id="expires" sx={styles.expiresText}>
            {t("confirmation.graphic.expires")}
            <Box
              className="content"
              fontSize={"clamp(1rem, 1rem + 0.2vw, 1.6rem)"}
            >
              {expirationDate || "NO DATE"}
            </Box>
          </GridItem>
          <GridItem sx={styles.logoItem}>
            <Logo decorative name="nyplFullWhite" size="small" mb="xs" />
          </GridItem>
          <Box
            className="grid-item barcode-container"
            sx={styles.barcodeContainer}
          >
            <canvas
              id="barcodeCanvas"
              {...canvasArgs}
              style={{ width: "100%", height: "2.5em" }}
            ></canvas>
            <Box className="barcode" sx={styles.barcode}>
              {barcode}
            </Box>
          </Box>
          <GridItem id="member-name" sx={styles.memberName}>
            {t("confirmation.graphic.memberName")}
            <Box className="content" fontSize="1.6em">
              {name}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default ConfirmationContainer;
