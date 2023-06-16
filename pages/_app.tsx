/* eslint-disable @typescript-eslint/no-var-requires */
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
import { getPageTitles } from "../src/utils/utils";
import useRouterScroll from "../src/hooks/useRouterScroll";
import { constructProblemDetail } from "../src/utils/formDataUtils";
import { DSProvider } from "@nypl/design-system-react-components";

import { appWithTranslation, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import aaUtils from "../src/externals/aaUtils";

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

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  useRouterScroll({ top: 640 });
  const formInitialStateCopy = { ...formInitialState };
  const formMethods = useForm<FormInputData>({ mode: "onBlur" });
  const { favIconPath, appTitle } = appConfig;

  // Setting the "lang" and the "dir" attribute
  const { i18n } = useTranslation("common");
  React.useEffect(() => {
    let lang = router.query.lang || "en";
    if (lang === "zhcn") {
      lang = "zh-cn";
    }
    document.getElementById("__next").dir = `${i18n.dir()}`;
    document.documentElement.lang = `${lang}`;
  });

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      aaUtils.pageViewEvent(url);
    };
    router.events.on("routeChangeComplete", () => {
      handleRouteChange(window.location.pathname);
    });
    return router.events.off("routeChangeComplete", () => {
      handleRouteChange(window.location.pathname);
    });
  }, [router.events]);

  let error;
  // These errors are from the server-side query string form submission.
  if (!isEmpty(router.query?.errors)) {
    const errorObject = JSON.parse(router.query.errors as any);
    // If we already received a problem detail, just forward it. Problem
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
        "",
        errorObject
      );
    }
    // We don't want to keep the errors in this object since it's
    // going to go into the app's store.
    delete router.query.errors;
  }
  // These are results specifically from the `/library-card/api/create-patron`
  // API endpoint, which makes a request to the NYPL Platform API. These are
  // results from the server-side form submission.
  if (!isEmpty(router.query?.results)) {
    formInitialStateCopy.results = JSON.parse(router.query.results as any);
  }

  // Update the form values state with the initial url query params in
  // the app's store state.
  formInitialStateCopy.formValues = {
    ...formInitialStateCopy.formValues,
    ...router.query,
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
      <DSProvider>
        <FormProvider {...formMethods}>
          <FormDataContextProvider initState={initState}>
            <ApplicationContainer problemDetail={error}>
              <Component
                {...pageProps}
                pageTitles={pageTitles}
                policyType={router.query.policyType}
              />
            </ApplicationContainer>
          </FormDataContextProvider>
        </FormProvider>
      </DSProvider>
    </>
  );
}

// `getServerSideProps` required for the `appWithTranslation`
// HOC for language translations.
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.req },
  };
};

// Allows the entire application to work with the `next-i18next` package.
export default appWithTranslation(MyApp as any);
