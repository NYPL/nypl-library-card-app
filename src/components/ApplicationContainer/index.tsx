import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Banner from "../Banner";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";
import {
  Template,
  TemplateBreakout,
  TemplateFull,
  TemplateMain,
} from "@nypl/design-system-react-components";

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
    <Template>
      <TemplateMain>
        <TemplateBreakout>
          <Banner />
        </TemplateBreakout>
        <TemplateFull>
          <>
            <ApiErrors
              lang={String(lang)}
              ref={errorSection}
              problemDetail={errorToDisplay}
            />
            {children}
          </>
        </TemplateFull>
      </TemplateMain>
    </Template>
  );
};

export default ApplicationContainer;
