import React from 'react';
import PropTypes from 'prop-types';

class FormField extends React.Component {
  renderInstructionText(text) {
    if (!text) {
      return null;
    }

    return (
      <span
        className="nypl-field-status"
        id={`${this.props.id}-status`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {text}
      </span>
    );
  }

  renderErrorBox() {
    return (
      <span
        className="nypl-field-status"
        id={`${this.props.id}-status`}
        aria-live="assertive"
        aria-atomic="true"
      >
        {this.props.errorState[this.props.fieldName]}
      </span>
    );
  }

  render() {
    const requiredMarkup = this.props.isRequired ?
      <span className="nypl-required-field"> Required</span> : null;
    let errorClass = '';
    let underInputSuggestion = this.renderInstructionText(this.props.instructionText);
    if (this.props.errorState && this.props.errorState[this.props.fieldName]) {
      errorClass = 'nypl-field-error';
      underInputSuggestion = this.renderErrorBox();
    }
    return (
      <div className={`${this.props.className} ${errorClass}`}>
        <label htmlFor={this.props.id} id={`${this.props.id}-label`}>
          {
            this.props.type === 'checkbox' ?
              <span className="visuallyHidden">{this.props.label}</span> :
              <span>{this.props.label}</span>
          }
          {requiredMarkup}
        </label>
        <input
          value={this.props.value}
          type={this.props.type}
          id={this.props.id}
          aria-required={this.props.type === 'checkbox' ? null : this.props.isRequired}
          aria-labelledby={
            (this.props.instructionText || (this.props.errorState && this.props.errorState[this.props.fieldName]))
              ? `${this.props.id}-label ${this.props.id}-status`
              : `${this.props.id}-label`
          }
          onChange={this.props.handleOnChange}
          checked={this.props.checked}
          maxLength={this.props.maxLength || null}
          onBlur={this.props.onBlur}
          ref={this.props.childRef}
          tabIndex="0"
        />
        {underInputSuggestion}
      </div>
    );
  }
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  errorState: PropTypes.shape(),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  handleOnChange: PropTypes.func,
  checked: PropTypes.bool,
  instructionText: PropTypes.string,
  maxLength: PropTypes.number,
  onBlur: PropTypes.func,
  childRef: PropTypes.func,
};

FormField.defaultProps = {
  className: '',
  value: '',
  isRequired: false,
  errorState: {},
};
export default FormField;
