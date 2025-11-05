import { Box, GridItem, Logo } from "@nypl/design-system-react-components";
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
    <Box className="confirmation-graphic" mb="s">
      <div className="image-lion">
        <Image
          alt="NYPL Library Barcode Background"
          height="727"
          src="/library-card/cardbg.png"
          width="939"
        />
        <div className="background-lion">
          <GridItem
            id="member-name"
            color={"white"}
            fontSize={"0.8em"}
            $breakpoint-intermediate={{ fontsize: "0.8em" }}
            $breakpoint-large={{ fontsize: "0.7em" }}
          >
            {t("confirmation.graphic.memberName")}
            <Box className="content" fontSize={"1.6em"}>
              {name}
            </Box>
          </GridItem>
          <GridItem
            color={"white"}
            fontSize={"0.6em"}
            $breakpoint-intermediate={{ fontsize: "0.8em" }}
            $breakpoint-large={{ fontsize: "0.7em" }}
          >
            <Logo
              decorative
              className="nypl-svg"
              name="nyplFullWhite"
              size="small"
            />
          </GridItem>
          <div className="grid-item barcode-container">
            <canvas id="barcodeCanvas" {...canvasArgs}></canvas>
            <div className="barcode">{barcode}</div>
          </div>

          <GridItem
            id="issued"
            color={"white"}
            fontSize={"1em"}
            $breakpoint-intermediate={{ fontsize: "1.25em" }}
            $breakpoint-large={{ fontsize: "1.5em" }}
            mb="s"
          >
            {t("confirmation.graphic.issued")}
            <Box className="content" fontSize={"1.6em"}>
              {new Date().toLocaleDateString()}
            </Box>
          </GridItem>
        </div>
      </div>
    </Box>
  );
};

export default ConfirmationContainer;
