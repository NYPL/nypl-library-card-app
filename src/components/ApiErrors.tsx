/* eslint-disable */
import React from "react";
import ErrorBox from "./ErrorBox";

interface ApiErrorsProps {
  // This needs a better API interface/type.
  apiResults: any;
}

const ApiErrors = React.forwardRef<HTMLDivElement, ApiErrorsProps>(
  ({ apiResults }, ref) => {
    let resultMarkup = null;

    if (apiResults.response.message) {
      resultMarkup = (
        <ErrorBox
          errorObject={apiResults.response}
          className="nypl-form-error"
        />
      );
    }
    return (
      <div ref={ref} className="nypl-error-content" tabIndex={0}>
        {resultMarkup}
      </div>
    );
  }
);

export default ApiErrors;
