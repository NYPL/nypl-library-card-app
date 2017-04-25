import React from 'react';

const ErrorBox = ({ errorObject, className }) => {
  const renderErrorByType = (errorObj) => {
    const { type } = errorObject;
    const {
      data: {
        simplePatron: {
          detail: {
            debug
          }
        }
      }
    } = errorObject;
    const defaultError = 'There was an error processing your submission. Please try again later.';
    let error;

    switch (type) {
      case 'unrecognized-address':
        error = <li>This address is invalid. Please enter a valid address.</li>;
        break;
      case 'unavailable-username':
        error =
          <li>This <a href="#patronUsername">username</a> is already taken. Please try again.</li>;
        break;
      default:
        if (debug && debug.birthdate) {
          error =
            <li>Please enter a valid date, MM/DD/YYYY. If you are 13 or younger, please apply in person.</li>;
        } else {
          error = <li>There was an error processing your submission. Please try again later.</li>;
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
