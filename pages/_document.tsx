import Document, { Html, Head, Main, NextScript } from "next/document";
import * as appConfig from "../appConfig";
const { adobeAnalyticsTag, dsHeader, dsFooter } = appConfig;

/**
 * MyDocument
 * This component used just to include the Optimizely and OptinMonster scripts
 * at the end of the body tag. Including it in the _app file won't work since
 * they need to be at the end.
 */
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* <!-- Initial Data Layer Definition --> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.gaDataLayer = []
                window.adobeDataLayer = [];
                const pageName = window.location.pathname.replace("/", "nypl|").replaceAll("/", "|") + window.location.search;
                window.adobeDataLayer.push({
                  page_name: pageName,
                  site_section: "Library Card Application Form"
                });`,
            }}
          />
          {/* <!-- Tag Manager Library Script --> */}
          <script src={adobeAnalyticsTag} async></script>
        </Head>
        <body>
          <noscript>
            <iframe
              title="Google-tag-name"
              src="https://www.googletagmanager.com/ns.html?id=GTM-RKWC"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* <!-- NYPL Header Script --> */}
          <div id="nypl-header"></div>
          <script src={dsHeader} async></script>
          <Main />
          {/* <!-- NYPL Footer Script --> */}
          <div id="nypl-footer"></div>
          <script src={dsFooter} async></script>
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
