import React from 'react';
import ErrorBox from '../../components/ErrorBox/ErrorBox';

class ApiErrors extends React.Component {
  constructor(props) {
    super(props);
  }

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
  apiResults: React.PropTypes.object,
  childRef: React.PropTypes.func,
};

export default ApiErrors;
