import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Hero from "../Hero";
import ApiErrors from "../ApiErrors";
import useFormDataContext from "../../context/FormDataContext";
import { isServerError } from "../../utils/apiErrorUtils";
import {
  Template,
  TemplateBreakout,
  TemplateContent,
  TemplateHeader,
  TemplateMain,
} from "@nypl/design-system-react-components";
import Breadcrumbs from "../Breadcrumb";

const ApplicationContainer = ({ children }) => {
  const router = useRouter();
  const {
    query: { lang },
  } = router;
  const errorSection = React.createRef<HTMLDivElement>();
  const { state } = useFormDataContext();
  const { errorObj } = state;
  const errorToDisplay = errorObj;
  const finalLang =
    typeof lang === "string"
      ? lang
      : Array.isArray(lang) && lang.length > 0
        ? lang[0]
        : "en";

  const isReviewPage = router.pathname === "/review";
  const hideApiErrors = isReviewPage && isServerError(errorToDisplay);

  // If there are errors, focus on the element that displays those errors,
  // for client-side rendering.
  useEffect(() => {
    if (errorToDisplay && !hideApiErrors) {
      errorSection.current?.focus();
    }
  }, [errorToDisplay, hideApiErrors]);

  return (
    <Template variant="narrow">
      <TemplateHeader id="mainHeader" m="0!" dir="ltr">
        <TemplateBreakout>
          <Breadcrumbs />
          <Hero />
        </TemplateBreakout>
      </TemplateHeader>
      <TemplateMain id="mainContent">
        <TemplateContent my="xl">
          <>
            {!hideApiErrors && (
              <ApiErrors
                lang={finalLang}
                ref={errorSection}
                problemDetail={errorToDisplay}
              />
            )}
            {children}
          </>
        </TemplateContent>
      </TemplateMain>
    </Template>
  );
};

export default ApplicationContainer;
