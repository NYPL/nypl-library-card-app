/* eslint-disable @typescript-eslint/no-var-requires */
import "@testing-library/jest-dom/extend-expect";
// Import this to be able to call this jest-axe assertion for all test files:
// expect(...).toHaveNoViolations();
import "jest-axe/extend-expect";

const { JSDOM } = require("jsdom");

const jsdom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});
const { window } = jsdom;
const exposedProperties = ["window", "navigator", "document"];

global.window = window;
global.document = window.document;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global["navigator"] = {
  userAgent: "node.js",
} as Navigator;
