import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

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
        <Head />
        <body>
          <div id="Header-Placeholder" style={{ minHeight: "230px" }}>
            <script
              type="text/javascript"
              src="https://header.nypl.org/dgx-header.min.js?skipNav=mainContent"
              async
            ></script>
          </div>

          <Main />
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
