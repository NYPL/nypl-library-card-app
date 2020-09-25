import React from "react";
import { Header, navConfig } from "@nypl/dgx-header-component";
import Footer from "@nypl/dgx-react-footer";
import Banner from "../Banner";

const ApplicationContainer: React.FC = ({ children }) => (
  <>
    <Header skipNav={{ target: "main-content" }} navData={navConfig.current} />
    <div className="nypl-library-card-app layout-container nypl-ds">
      <main id="main-content" className="main main--with-sidebar">
        <div className="content-header">
          <Banner />
        </div>
        <div className="content-primary content-primary--with-sidebar-right">
          {children}
        </div>
        <div className="content-secondary content-secondary--with-sidebar-right" />
      </main>
    </div>
    <Footer />
  </>
);

export default ApplicationContainer;
