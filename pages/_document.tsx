import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import Footer from "@nypl/dgx-react-footer";

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
        <Head />
        <body>
          <div id="Header-Placeholder" style={{ minHeight: "230px" }}>
            <div id="nypl-header"></div>
            <script
              type="text/javascript"
              src="https://header.nypl.org/dgx-header.min.js?skipNav=main-content&containerId=nypl-header"
              async
            ></script>
          </div>

          <Main />
          <Footer />
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
