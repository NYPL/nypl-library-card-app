/* eslint-disable @typescript-eslint/no-var-requires */
import { useEffect } from "react";
import "@nypl/design-system-react-components/dist/styles.css";
import "../src/styles/main.scss";
import Head from "next/head";
import { useForm, FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import {
  FormDataContextProvider,
  formInitialState,
} from "../src/context/FormDataContext";
import * as appConfig from "../appConfig";
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

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  useRouterScroll({ top: 640 });
  const formInitialStateCopy = { ...formInitialState };
  const formMethods = useForm<FormInputData>({ mode: "onBlur" });
  const { favIconPath, appTitle } = appConfig;

  // Setting the "lang" and the "dir" attribute
  const { i18n } = useTranslation("common");
  useEffect(() => {
    if (isEmpty(i18n)) return;
    let lang = router.query.lang || "en";
    if (lang === "zhcn") {
      lang = "zh-cn";
    }
    document.getElementById("__next").dir = `${i18n.dir()}`;
    document.documentElement.lang = `${lang}`;
  }, [i18n, router.query]);

  useEffect(() => {
    const handleRouteChange = () => {
      aaUtils.pageViewEvent(window.location);
    };
    router.events.on("routeChangeComplete", () => handleRouteChange());
    return router.events.off("routeChangeComplete", () => handleRouteChange());
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
    console.log("MyApp error: ", error);
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
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-RKWC');
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
