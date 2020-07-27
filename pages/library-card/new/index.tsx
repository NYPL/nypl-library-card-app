import React from "react";
import ApplicationContainer from "../../../src/components/ApplicationContainer";
import { ParamsContextProvider } from "../../../src/context/ParamsContext";
import LibraryCardForm from "../../../src/components/LibraryCardForm/LibraryCardForm";

function HomePage({ query }) {
  return (
    <ParamsContextProvider params={query}>
      <ApplicationContainer>
        <LibraryCardForm />
      </ApplicationContainer>
    </ParamsContextProvider>
  );
}

HomePage.getInitialProps = ({ query }) => {
  return { query };
};

export default HomePage;
