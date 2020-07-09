import React from "react";
import "@nypl/design-system-react-components/dist/styles.css";
import "../src/styles/main.scss";

interface MyAppProps {
  Component: any;
  pageProps: any;
}

export default function MyApp<MyAppProps>({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
