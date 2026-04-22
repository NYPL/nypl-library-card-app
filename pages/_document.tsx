import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import * as appConfig from "../appConfig";
const { dsHeader, dsFooter } = appConfig;
import newrelic from "newrelic";
import Script from "next/script";

type DocumentProps = {
  browserTimingHeader: string;
  isVercel: boolean;
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
    const isVercel = process.env.NEXT_PUBLIC_VERCEL_BUILD === "1";

    const browserTimingHeader = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
      allowTransactionlessInjection: true,
    });

    return {
      ...initialProps,
      browserTimingHeader,
      isVercel,
    };
  }

  render() {
    const { browserTimingHeader, isVercel } = this.props;
    return (
      <Html lang="en">
        <Head />
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
          {/* 
              Vercel serverless environment prevents us from generating the 
              browser header from the agent, so we are injecting the QA instance manually 
          */}
          {isVercel && (
            <script
              type="text/javascript"
              src="/library-card/js/new-relic-browser.js"
            />
          )}
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
