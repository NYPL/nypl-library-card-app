import React from "react";
import Head from "next/head";
import ApplicationContainer from "../../../src/components/Application/ApplicationContainer";
import { config, gaUtils } from "dgx-react-ga";
import appConfig from "../../../appConfig";

/**
 * Determines if we are running on server or in the client.
 * @return {boolean} true if running on server
 */
function isServerRendered(): boolean {
  return typeof window === 'undefined';
}

// Set up Google Analytics on the client side.
// TODO: This is using an older NYPL GA package and should be updated later.
if (!isServerRendered()) {
  if (!window["ga"]) {
    const isProd = process.env.NODE_ENV === 'production';
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(config.google.code(isProd), gaOpts);
  }

  gaUtils.trackPageview(window.location.pathname);
}

// Accessibility helper that outputs to the console on dev and test
// environment only and client-side only.
// https://github.com/dequelabs/react-axe
if (process.env.USE_AXE_ENV === 'true' && !isServerRendered()) {
  const ReactDOM = require('react-dom');
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}

function HomePage() {
  // TODO: Work on CSRF token auth.
  const csrfToken = "";
  const { favIconPath, appTitle } = appConfig;
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{appTitle} | NYPL</title>
        <link rel="icon" type="image/png" href={favIconPath} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="With a library card you get free access to resources and services across all New York Public Library locations." />
        <meta name="keywords" content="NYPL, The New York Public Library, Manhattan, Bronx, Staten Island" />
        <meta name="rights" content={`© ${new Date().getFullYear()} The New York Public Library`} />
        <meta property="og:title" content="Apply for a library card from NYPL" />
        <meta property="og:description" content="Get free access to resources and services with a New York Public Library card." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.nypl.org/sites/default/files/library_card-1200x800.jpg" />
        <meta property="og:site_name" content="The New York Public Library" />
        <meta property="og:url" content="https://www.nypl.org/library-card/new" />
        <meta name="twitter:title" content="Apply for a library card from NYPL" />
        <meta name="twitter:description" content="Get free access to resources and services with a New York Public Library card." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nypl" />
        <meta name="twitter:creator" content="@nypl" />
        <meta name="twitter:image" content="https://www.nypl.org/sites/default/files/library_card-1200x800.jpg" />
        <meta name="csrf-token" content={csrfToken} />
      </Head>
      <ApplicationContainer />
    </>
  );
}

export default HomePage;