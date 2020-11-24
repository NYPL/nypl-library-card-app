import React, { useEffect } from "react";
import { Header, navConfig } from "@nypl/dgx-header-component";
import Footer from "@nypl/dgx-react-footer";
import Banner from "../Banner";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";

const ApplicationContainer = ({ children, problemDetail }) => {
  const errorSection = React.createRef<HTMLDivElement>();
  const { state } = useFormDataContext();
  const { errorObj } = state;
  const errorToDisplay = problemDetail ? problemDetail : errorObj;

  // If there are errors, focus on the element that displays those errors,
  // for client-side rendering.
  useEffect(() => {
    if (errorToDisplay) {
      errorSection.current.focus();
    }
  }, [errorToDisplay]);

  return (
    <>
      <Header
        skipNav={{ target: "main-content" }}
        navData={navConfig.current}
      />
      <div className="nypl-library-card-app nypl-ds">
        <main id="main-content" className="main main--with-sidebar">
          <div className="content-header">
            <Banner />
          </div>
          <div className="content-primary content-primary--with-sidebar-right">
            <ApiErrors ref={errorSection} problemDetail={errorToDisplay} />
            {children}
          </div>
          <div className="content-secondary content-secondary--with-sidebar-right" />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationContainer;
