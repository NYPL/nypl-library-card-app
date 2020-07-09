import React from "react";
import { Header, navConfig } from "@nypl/dgx-header-component";
import Footer from "@nypl/dgx-react-footer";
import LibraryCardForm from "../LibraryCardForm/LibraryCardForm";
import Banner from "../Banner";

const ApplicationContainer = () => (
  <div className="nypl-library-card-app">
    <Header skipNav={{ target: "main-content" }} navData={navConfig.current} />
    <main id="main-content" className="main">
      <div className="content-header">
        <Banner />
      </div>
      <div className="content-primary">
        <LibraryCardForm />
      </div>
    </main>
    <Footer />
  </div>
);

export default ApplicationContainer;
