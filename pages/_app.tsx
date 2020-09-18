import React from "react";
import "@nypl/design-system-react-components/dist/styles.css";
import Head from "next/head";
import { useForm, FormProvider } from "react-hook-form";
import ga from "../src/externals/ga";
import { FormDataContextProvider } from "../src/context/FormDataContext";
import { IPLocationContextProvider } from "../src/context/IPLocationContext";
import "../src/styles/main.scss";
import appConfig from "../appConfig";
import { FormInputData } from "../src/interfaces";
import ApplicationContainer from "../src/components/ApplicationContainer";
import IPLocationAPI from "../src/utils/IPLocationAPI";
import enableAxe from "../src/utils/axe";

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
  ga.setupAnalytics(window["ga"], appConfig.nodeEnv);
}

// Only run react-axe in the client-side and when the flag is set.
if (appConfig.useAxe === "true" && !isServerRendered()) {
  enableAxe();
}

function MyApp<MyAppProps>({ Component, pageProps, userLocation }) {
  const formMethods = useForm<FormInputData>({ mode: "onBlur" });
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
        <IPLocationContextProvider userLocation={userLocation}>
          <FormDataContextProvider>
            <ApplicationContainer>
              <Component {...pageProps} />
            </ApplicationContainer>
          </FormDataContextProvider>
        </IPLocationContextProvider>
      </FormProvider>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  // Get the user's IP address and convert it to an object that tells us if
  // the user is in NYS/NYC. Will be `undefined` if the call to the IP/location
  // conversion API fails or if there is no IP address.
  let userLocation = {};
  if (ctx.req?.headers) {
    userLocation = await IPLocationAPI.getLocationFromIP(ctx);
  }

  // Send it to the component as a prop.
  return { userLocation };
};

export default MyApp;
