import React from 'react';
import { renderServerValidationError } from './../../../utils/FormValidationUtils.js';

const ErrorBox = ({ errorObject, className }) => {
  const renderErrorByType = (errorObj) => {
    const { type, details } = errorObject;
    const defaultError = 'There was an error processing your submission. Please try again later.';
    let error;

    if (type) {
      switch (type) {
        case 'unrecognized-address':
          error = <li>This <a href="#patronStreet1">address</a> is invalid. Please enter a valid address.</li>;
          break;
        case 'unavailable-username':
          error =
            <li>This <a href="#patronUsername">username</a> is already taken. Please try again.</li>;
          break;
        case 'server-validation-error':
          error = <div>{renderServerValidationError(details)}</div>;
          break;
        case 'server':
          error =
            <li>There was a system error processing your request. Please try again.</li>;
          break;
        default:
          error = <li>{defaultError}</li>;
      }
    } else {
      const {
        data: {
          simplePatron: {
            detail: {
              debug,
            },
          },
        },
      } = errorObject;

      if (debug && debug.birthdate) {
        error =
          <li>Please enter a valid <a href="#patronDob">date</a>, MM/DD/YYYY, including slashes. If you are 13 or younger, please apply in person.</li>;
      } else if (debug && debug.address) {
        error = <li>This <a href="#patronStreet1">address</a> is invalid. Please enter a valid address.</li>;
      } else {
        error = <li>{defaultError}</li>;
      }
    }

    return (
      <ul>
        {error}
      </ul>
    );
  };

  return (
    <div className={className}>
      <h2>There were errors in your form submission. Please correct these fields:</h2>
      {renderErrorByType(errorObject)}
    </div>
  );
};

ErrorBox.propTypes = {
  className: React.PropTypes.string,
  errorObject: React.PropTypes.object.isRequired,
};

ErrorBox.defaultProps = {
  className: 'nypl-error-box',
};

export default ErrorBox;
