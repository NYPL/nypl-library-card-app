import React from "react";
import "@nypl/design-system-react-components/dist/styles.css";
import "../src/styles/main.scss";
import Head from "next/head";
import { useForm, FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import gaUtils, { getGoogleGACode } from "../src/externals/gaUtils";
import {
  FormDataContextProvider,
  formInitialState,
} from "../src/context/FormDataContext";
import appConfig from "../appConfig";
import { FormInputData } from "../src/interfaces";
import ApplicationContainer from "../src/components/ApplicationContainer";
import enableAxe from "../src/utils/axe";
import { getPageTitles } from "../src/utils/utils";
import useRouterScroll from "../src/hooks/useRouterScroll";
import { constructProblemDetail } from "../src/utils/formDataUtils";

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

// Get the Google Analytics code for the HTML snippet below.
const isProduction = appConfig.nodeEnv === "production";
const gaCode = getGoogleGACode(isProduction);
// Set up Google Analytics if it isn't already. There's an HTML snippet in the
// DOM below that initializes GA. If it fails, this tries again. The HTML
// snippet is better since it works without javascript.
if (!isServerRendered()) {
  gaUtils.setupAnalytics(isProduction);
}

// Only run react-axe in the client-side and when the flag is set.
if (appConfig.useAxe === "true" && !isServerRendered()) {
  enableAxe();
}

function MyApp<MyAppProps>({ Component, pageProps, query }) {
  useRouterScroll({ top: 640 });
  const formInitialStateCopy = { ...formInitialState };
  const formMethods = useForm<FormInputData>({ mode: "onBlur" });
  const { favIconPath, appTitle } = appConfig;

  let error;
  // These errors are from the server-side query string form submission.
  if (!isEmpty(query.errors)) {
    const errorObject = JSON.parse(query.errors);
    // If we already received a problem detail, just forward it. Problme
    // details get sent when a request is sent to the NYPL Platform API.
    // If we get simple errors from form field validation, create the problem
    // detail for the errors.
    if (errorObject?.status) {
      error = errorObject;
    } else {
      error = constructProblemDetail(
        400,
        "invalid-request",
        "Invalid Request",
        "There were errors with your submission.",
        errorObject
      );
    }
    // We don't want to keep the errors in this object since it's
    // going to go into the app's store.
    delete query.errors;
  }
  // These are results specifically from the `/library-card/api/create-patron`
  // API endpoint, which makes a request to the NYPL Platform API. These are
  // results from the server-side form submission.
  if (!isEmpty(query.results)) {
    formInitialStateCopy.results = JSON.parse(query.results);
  }

  // Update the form values state with the initial url query params in
  // the app's store state.
  formInitialStateCopy.formValues = {
    ...formInitialStateCopy.formValues,
    ...query,
  };
  const initState = { ...formInitialStateCopy };
  const pageTitles = getPageTitles();

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
        {/* <!-- Google Analytics --> */}
        {/* We can't directly put the script into this component because React
            doesn't allow it, so we must add it through the
            `dangerouslySetInnerHTML` prop.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
              (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
              })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

              ga('create', '${gaCode}', 'auto');
              ga('send', 'pageview');
            `,
          }}
        />
        {/* <!-- End Google Analytics --> */}
      </Head>
      <FormProvider {...formMethods}>
        <FormDataContextProvider initState={initState}>
          <ApplicationContainer problemDetail={error}>
            <Component
              {...pageProps}
              pageTitles={pageTitles}
              policyType={query.policyType}
            />
          </ApplicationContainer>
        </FormDataContextProvider>
      </FormProvider>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  // Send it to the component as a prop.
  return { query: ctx.query };
};

export default MyApp;
