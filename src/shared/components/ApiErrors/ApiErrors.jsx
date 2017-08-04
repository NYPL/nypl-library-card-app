import React from 'react';
import PropTypes from 'prop-types';
import ErrorBox from '../../components/ErrorBox/ErrorBox';

class ApiErrors extends React.Component {
  render() {
    const apiResults = this.props.apiResults;
    const errorClass = 'nypl-error-content';
    let resultMarkup = null;

    if (apiResults.response) {
      resultMarkup = <ErrorBox errorObject={apiResults.response} className="nypl-form-error" />;
    }

    return (
      <div ref={this.props.childRef} className={errorClass} tabIndex="0">
        {resultMarkup}
      </div>
    );
  }
}

ApiErrors.propTypes = {
  apiResults: PropTypes.object,
  childRef: PropTypes.func,
};

export default ApiErrors;
