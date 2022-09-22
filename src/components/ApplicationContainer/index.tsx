// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useEffect } from "react";
// import { Header, navConfig } from "@nypl/dgx-header-component";
import Footer from "@nypl/dgx-react-footer";
import Banner from "../Banner";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";
import { TemplateAppContainer } from "@nypl/design-system-react-components";

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
    <TemplateAppContainer
      className="nypl-library-card-app"
      breakout={<Banner />}
      contentPrimary={
        <>
          <ApiErrors ref={errorSection} problemDetail={errorToDisplay} />
          {children}
        </>
      }
      sidebar="right"
      footer={<Footer />}
    />
  );
};

export default ApplicationContainer;
