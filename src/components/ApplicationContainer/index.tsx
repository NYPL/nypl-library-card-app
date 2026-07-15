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
            <details style={{ marginTop: "2rem" }}>
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                Debug Panel
              </summary>
              <div style={{ paddingLeft: "1rem" }}>
                <DebugSection
                  title="Identity Verification Result"
                  data={state.identityVerificationResult}
                />

                <DebugSection
                  title="Email Check Result"
                  data={state.emailCheckResult}
                />

                <DebugSection
                  title="DB Check Result"
                  data={state.dbCheckResult}
                />
              </div>
            </details>
          </>
        </TemplateContent>
      </TemplateMain>
    </Template>
  );
};

const DebugSection = ({ title, data }) => {
  if (data === null || data === undefined) return null;
  return (
    <details
      style={{
        marginTop: "1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        background: "#fafafa",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          fontWeight: "600",
          padding: "0.5rem 1rem",
          fontSize: "0.85rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#555",
          userSelect: "none",
        }}
      >
        {title}
      </summary>
      <pre
        style={{
          fontSize: "0.75rem",
          overflow: "auto",
          background: "#f4f4f4",
          padding: "1rem",
          margin: "0",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
};

export default ApplicationContainer;
