import React from 'react';

const ErrorBox = ({ errorObject, className }) => {
  const renderErrorByType = (errorObj) => {
    const { type } = errorObject;
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
       case 'age-not-valid':
        error =
          <li>Please enter a valid date, MM/DD/YYYY. If you are 13 or younger, please apply in person.</li>;
        break;
      case 'exception':
        error = (errorObj.debugMessage && errorObj.debugMessage.includes('pin')) ?
          <li>The <a href="#patronPin">PIN</a> is invalid. Please use 4 digits.</li> :
          <li>{defaultError}</li>;
        break;
      default:
        error = <li>There was an error processing your submission. Please try again later.</li>;
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
