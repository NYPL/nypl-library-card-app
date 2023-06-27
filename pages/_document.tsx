import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import appConfig from "../appConfig";
const { adobeAnalyticsTag, dsHeader, dsFooter } = appConfig;

/**
 * MyDocument
 * This component used just to include the Optimizely and OptinMonster scripts
 * at the end of the body tag. Including it in the _app file won't work since
 * they need to be at the end.
 */
class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="en">
        <Head>
          {/* <!-- Initial Data Layer Definition --> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.adobeDataLayer = [];
                window.adobeDataLayer.push({
                  page_name: "Library Card App | " + window.location.pathname.split("/").pop(),
                  site_section: "Library Card Application Form"
                });`,
            }}
          />
          {/* <!-- Tag Manager Library Script --> */}
          <script src={adobeAnalyticsTag} async></script>
        </Head>
        <body>
          {/* <!-- NYPL Header Script --> */}
          <div id="nypl-header"></div>
          <script type="module" src={dsHeader} async></script>
          <Main />
          {/* <!-- NYPL Footer Script --> */}
          <div id="nypl-footer"></div>
          <script type="module" src={dsFooter} async></script>
          <NextScript />
          {/* <!-- Optimizely --> */}
          <script src="https://cdn.optimizely.com/js/284748925.js"></script>
          {/* <!-- OptinMonster --> */}
          <script src="https://assets.nypl.org/js/advocacy.js"></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
