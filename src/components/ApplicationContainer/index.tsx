import React from "react";
import { Header, navConfig } from "@nypl/dgx-header-component";
import Footer from "@nypl/dgx-react-footer";
import Banner from "../Banner";

const ApplicationContainer: React.FC = ({ children }) => (
  <div className="nypl-library-card-app">
    <Header skipNav={{ target: "main-content" }} navData={navConfig.current} />
    <main id="main-content" className="main">
      <div className="content-header">
        <Banner />
      </div>
      <div className="content-primary">{children}</div>
    </main>
    <Footer />
  </div>
);

export default ApplicationContainer;
