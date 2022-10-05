// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TemplateAppContainer } from "@nypl/design-system-react-components";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Banner from "../Banner";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";

const ApplicationContainer = ({ children, problemDetail }) => {
  const {
    query: { lang = "en" },
  } = useRouter();
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
          <ApiErrors
            lang={lang}
            ref={errorSection}
            problemDetail={errorToDisplay}
          />
          {children}
        </>
      }
      sidebar="right"
      marginBottom="l"
    />
  );
};

export default ApplicationContainer;
