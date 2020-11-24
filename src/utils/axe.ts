/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";

/**
 * Accessibility helper that outputs to the console on dev and test
 * environment only and client-side only.
 * @see https://github.com/dequelabs/react-axe
 */
export default async function enableAxe() {
  const ReactDOM = require("react-dom");
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}
