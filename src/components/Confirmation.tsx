import React, { useEffect } from "react";
import bwipjs from "bwip-js";
import { FormResults } from "../interfaces";
import { Icon, LogoNames } from "@nypl/design-system-react-components";

const Confirmation: React.FC<{ formResults: FormResults }> = ({
  formResults = {},
}) => {
  const { barcode, username, pin, temporary, message, name } = formResults;

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
  // This is easier, for now, to render through the component rather than
  // through scss.
  const bgStyles = {
    backgroundImage: "url('./cardbg.png')",
  };

  return (
    <div className="nypl-full-width-wrapper">
      <p className="name-message">Thank you for submitting your application.</p>
      <div className="background-lion" style={bgStyles}>
        <div className="grid-item">
          MEMBER NAME
          <div className="content">{name}</div>
        </div>
        <div className="grid-item">
          <Icon
            decorative
            className="nypl-svg"
            name={LogoNames["logo_nypl_negative"]}
          />
        </div>
        <div className="grid-item barcode-container">
          <canvas id="barcodeCanvas"></canvas>
          <div className="barcode">{barcode}</div>
        </div>
        <div className="grid-item">
          PIN
          <div className="content">{pin}</div>
        </div>
        <div className="grid-item">
          ISSUED
          <div className="content">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Still dummy content for now. */}
      <ul>
        <li>username: {username}</li>
        <li>temporary: {`${temporary}`}</li>
        <li>message: {message}</li>
      </ul>
    </div>
  );
};

export default Confirmation;
