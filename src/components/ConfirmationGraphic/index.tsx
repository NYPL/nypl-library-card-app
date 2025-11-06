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

const ConfirmationContainer = () => {
  const { state } = useFormDataContext();
  const formResults = state.results || ({} as FormResults);
  const { barcode, name } = formResults;
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
    <Box
      mb="s"
      bg="var(--nypl-colors-ui-gray-light-cool)"
      position="relative"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Box
        className="image-lion"
        position="relative"
        fontSize="1em"
        mx="0 auto"
        width={{ base: "100%", md: "80%", lg: "60%" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Image
          alt="NYPL Library Barcode Background"
          height="727"
          src="/library-card/cardbg.png"
          width="939"
        />
        <Grid
          className="background-lion"
          top="6"
          width="100%"
          position="absolute"
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          height="100%"
          p="0 40px 0 25px"
          gap="10px 5px"
          gridTemplateColumns="58% 30%"
          gridTemplateRows="20% 40% 20%"
          justifyContent="center"
          alignItems="center"
        >
          <GridItem id="member-name" color="white" fontSize="0.8em">
            {t("confirmation.graphic.memberName")}
            <Box className="content" fontSize="1.6em">
              {name}
            </Box>
          </GridItem>
          <GridItem color="white" fontSize="0.6em" mt="20px">
            <Logo decorative name="nyplFullWhite" size="small" mb="xs" />
          </GridItem>
          <Box
            className="grid-item barcode-container"
            bg="white"
            p="15px 20px 0px"
            display="inline-block"
            gridColumn="1/3"
            gridRow="2/2"
            borderTopLeftRadius="3px"
            borderTopRightRadius="3px"
            borderBottomLeftRadius="5px"
            borderBottomRightRadius="5px"
          >
            <canvas
              id="barcodeCanvas"
              {...canvasArgs}
              style={{ width: "100%", height: "50px" }}
            ></canvas>
            <Box
              className="barcode"
              color="black"
              mx="auto"
              position="relative"
              fontSize="2em"
              display="table"
            >
              {barcode}
            </Box>
          </Box>

          <GridItem id="issued" color="white" fontSize="1em" mb="s">
            {t("confirmation.graphic.issued")}
            <Box className="content" fontSize={"1.6em"}>
              {new Date().toLocaleDateString()}
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default ConfirmationContainer;
