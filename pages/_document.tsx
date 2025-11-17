import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import * as appConfig from "../appConfig";
const { adobeAnalyticsTag, dsHeader, dsFooter } = appConfig;
import newrelic from "newrelic";
import Script from "next/script";

type DocumentProps = {
  browserTimingHeader: string;
};
/**
 * MyDocument
 * This component used just to include the Optimizely and OptinMonster scripts
 * at the end of the body tag. Including it in the _app file won't work since
 * they need to be at the end.
 */
class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & DocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    const browserTimingHeader = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true,
    });

    return {
      ...initialProps,
      browserTimingHeader,
    };
  }

  render() {
    const { browserTimingHeader } = this.props;
    return (
      <Html lang="en">
        <Head>
          {/* <!-- Initial Data Layer Definition --> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
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
          {/* New Relic Browser Metric */}
          <Script
            dangerouslySetInnerHTML={{ __html: browserTimingHeader }}
            id="nr-browser-agent"
            strategy="beforeInteractive"
          ></Script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
