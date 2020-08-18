import React from "react";
import { ParamsContextProvider } from "../../../src/context/ParamsContext";
import LibraryCardForm from "../../../src/components/LibraryCardForm";

function HomePage({ query }) {
  return (
    <ParamsContextProvider params={query}>
      <LibraryCardForm />
    </ParamsContextProvider>
  );
}

HomePage.getInitialProps = ({ query }) => {
  return { query };
};

export default HomePage;
