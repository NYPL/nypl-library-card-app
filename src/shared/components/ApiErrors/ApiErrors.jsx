import React from 'react';
import isEmpty from 'lodash/isEmpty';
import ErrorBox from '../../components/ErrorBox/ErrorBox';

class ApiErrors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const apiResults = this.props.apiResults;
    let resultMarkup = null;
    let errorClass = '';

    // TODO: Will be modified once we establish the correct API response from Wrapper
    if (!isEmpty(apiResults) && apiResults.status >= 300 && !apiResults.response.id) {
      errorClass = 'nypl-error-content';

      resultMarkup = <ErrorBox errorObject={apiResults.response} className="nypl-form-error" />;
    }

    return (
      <div ref={this.props.childRef} className={errorClass} tabIndex="0">
        {resultMarkup}
      </div>
    );
  }
}

export default ApiErrors;
