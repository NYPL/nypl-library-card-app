import React from "react";
import { renderServerValidationError } from "../../utils/FormValidationUtils";

interface ErrorBoxProps {
  className: string;
  errorObject?: {
    type: string;
    details: any;
    message: string;
    data: any;
  };
}

const ErrorBox = ({
  errorObject,
  className = "nypl-error-box",
}: ErrorBoxProps) => {
  const renderErrorByType = (errorObj) => {
    const { type, details, message } = errorObj;
    const defaultError =
      "There was an error processing your submission. Please try again later.";
    let error;

    if (type) {
      switch (type) {
        case "unrecognized-address":
          error = (
            <li>
              This <a href="#input-patronLine1-home">address</a> is invalid.
              Please enter a valid address.
            </li>
          );
          break;
        case "unavailable-username":
          error = (
            <li>
              This <a href="#input-patronUsername">username</a> is already
              taken. Please try again.
            </li>
          );
          break;
        case "invalid-request":
          error = <>{renderServerValidationError(message)}</>;
          break;
        case "server-validation-error":
          error = <>{renderServerValidationError(details)}</>;
          break;
        case "server":
          error = (
            <li>
              There was a system error processing your request. Please try
              again.
            </li>
          );
          break;
        default:
          error = <li>{defaultError}</li>;
      }
    } else {
      const {
        data: {
          simplePatron: {
            detail: { debug },
          },
        },
      } = errorObject;

      if (debug && debug.birthdate) {
        error = (
          <li>
            Please enter a valid <a href="#input-patronDob">date</a>,
            MM/DD/YYYY, including slashes. If you are 12 or younger, please
            apply in person.
          </li>
        );
      } else if (debug && debug.address) {
        error = (
          <li>
            This <a href="#input-patronLine1">address</a> is invalid. Please
            enter a valid address.
          </li>
        );
      } else if (debug && debug.email) {
        error = (
          <li>
            This <a href="#input-patronEmail">email address</a> is invalid.
            Please enter a valid email address.
          </li>
        );
      } else {
        error = <li>{defaultError}</li>;
      }
    }

    return <ul>{error}</ul>;
  };

  return (
    <div className={className}>
      <h2>
        There were errors in your form submission. Please correct these fields:
      </h2>
      {renderErrorByType(errorObject)}
    </div>
  );
};

export default ErrorBox;
