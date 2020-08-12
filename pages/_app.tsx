import React from "react";
import "@nypl/design-system-react-components/dist/styles.css";
import { config, gaUtils } from "dgx-react-ga";
import Head from "next/head";
import { FormDataContextProvider } from "../src/context/FormDataContext";
import "../src/styles/main.scss";
import appConfig from "../appConfig";
import { useGlobalFormHook, formInitialState } from "../src/hooks";
import { useForm, FormProvider } from "react-hook-form";

interface MyAppProps {
  Component: any;
  pageProps: any;
}

/**
 * Determines if we are running on server or in the client.
 * @return {boolean} true if running on server
 */
function isServerRendered(): boolean {
  return typeof window === "undefined";
}

// Set up Google Analytics on the client side.
// TODO: This is using an older NYPL GA package and should be updated later.
if (!isServerRendered()) {
  if (!window["ga"]) {
    const isProd = process.env.NODE_ENV === "production";
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(config.google.code(isProd), gaOpts);
  }

  gaUtils.trackPageview(window.location.pathname);
}

// Accessibility helper that outputs to the console on dev and test
// environment only and client-side only.
// https://github.com/dequelabs/react-axe
if (process.env.TEST_AXE_ENV === "true" && !isServerRendered()) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactDOM = require("react-dom");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axe = require("react-axe");
  axe(React, ReactDOM, 1000);
}

// The interface for the react-hook-form state data object.
interface FormInput {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  "home-line1": string;
  "home-line2": string;
  "home-city": string;
  "home-state": string;
  "home-zip": string;
  "work-line1": string;
  "work-line2": string;
  "work-city": string;
  "work-state": string;
  "work-zip": string;
  username: string;
  pin: string;
  ecommunicationsPref: boolean;
  location?: string;
  homeLibraryCode: string;
  acceptTerms: boolean;
}

export default function MyApp<MyAppProps>({ Component, pageProps }) {
  // Keep track of the API results and errors from a form submission as global
  // data in the app. It is exposed to the two pages through context. Use
  // the `dispatch` function to update the state properties.
  const { state, dispatch } = useGlobalFormHook(formInitialState);
  const formMethods = useForm<FormInput>({
    mode: "onBlur",
    defaultValues: state.formValues,
  });
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
        <meta
          name="description"
          content="With a library card you get free access to resources and services across all New York Public Library locations."
        />
        <meta
          name="keywords"
          content="NYPL, The New York Public Library, Manhattan, Bronx, Staten Island"
        />
        <meta
          name="rights"
          content={`© ${new Date().getFullYear()} The New York Public Library`}
        />
        <meta
          property="og:title"
          content="Apply for a library card from NYPL"
        />
        <meta
          property="og:description"
          content="Get free access to resources and services with a New York Public Library card."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://www.nypl.org/sites/default/files/library_card-1200x800.jpg"
        />
        <meta property="og:site_name" content="The New York Public Library" />
        <meta
          property="og:url"
          content="https://www.nypl.org/library-card/new"
        />
        <meta
          name="twitter:title"
          content="Apply for a library card from NYPL"
        />
        <meta
          name="twitter:description"
          content="Get free access to resources and services with a New York Public Library card."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@nypl" />
        <meta name="twitter:creator" content="@nypl" />
        <meta
          name="twitter:image"
          content="https://www.nypl.org/sites/default/files/library_card-1200x800.jpg"
        />
        <meta name="csrf-token" content={csrfToken} />
      </Head>
      <FormProvider {...formMethods}>
        <FormDataContextProvider value={{ state, dispatch }}>
          <Component {...pageProps} />
        </FormDataContextProvider>
      </FormProvider>
    </>
  );
}
