import { Logo } from "@nypl/design-system-react-components";
import bwipjs from "bwip-js";
import Image from "next/image";
import React, { useEffect } from "react";

import { FormResults } from "../../interfaces";
import useFormDataContext from "../../context/FormDataContext";

const ConfirmationContainer: React.FC = () => {
  const canvasArgs = { role: "img", ["aria-label"]: "Scannable barcode" };
  const { state } = useFormDataContext();
  const formResults = state.results || ({} as FormResults);
  const { barcode, password, name } = formResults;
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
    <div className="confirmation-graphic">
      <div className="image-lion">
        <Image
          alt="NYPL Library Barcode Background"
          height="727"
          src="/library-card/cardbg.png"
          width="939"
        />
        <div className="background-lion">
          <div className="grid-item">
            MEMBER NAME
            <div className="content">{name}</div>
          </div>
          <div className="grid-item">
            <Logo decorative className="nypl-svg" name="nyplFullWhite" />
          </div>
          <div className="grid-item barcode-container">
            <canvas id="barcodeCanvas" {...canvasArgs}></canvas>
            <div className="barcode">{barcode}</div>
          </div>
          <div className="grid-item">
            PASSWORD
            <div className="content">{password}</div>
          </div>
          <div className="grid-item">
            ISSUED
            <div className="content">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationContainer;
