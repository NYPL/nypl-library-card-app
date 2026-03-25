import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Hero from "../Hero";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";
import {
  Template,
  TemplateBreakout,
  TemplateContent,
  TemplateHeader,
  TemplateMain,
} from "@nypl/design-system-react-components";
import Breadcrumbs from "../Breadcrumb";

const ApplicationContainer = ({ children, problemDetail }) => {
  const {
    query: { lang },
  } = useRouter();
  const errorSection = React.createRef<HTMLDivElement>();
  const { state } = useFormDataContext();
  const { errorObj } = state;
  const errorToDisplay = problemDetail ? problemDetail : errorObj;
  const finalLang =
    typeof lang === "string"
      ? lang
      : Array.isArray(lang) && lang.length > 0
        ? lang[0]
        : "en";

  // If there are errors, focus on the element that displays those errors,
  // for client-side rendering.
  useEffect(() => {
    if (errorToDisplay) {
      errorSection.current.focus();
    }
  }, [errorToDisplay]);

  return (
    <Template variant="narrow">
      <TemplateHeader m="0!">
        <TemplateBreakout>
          <Breadcrumbs />
          <Hero />
        </TemplateBreakout>
      </TemplateHeader>
      <TemplateMain id="mainContent">
        <TemplateContent my="xl">
          <>
            <ApiErrors
              lang={finalLang}
              ref={errorSection}
              problemDetail={errorToDisplay}
            />
            {children}
          </>
        </TemplateContent>
      </TemplateMain>
    </Template>
  );
};

export default ApplicationContainer;
