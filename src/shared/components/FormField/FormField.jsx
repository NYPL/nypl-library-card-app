import React from 'react';

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
      <div className="nypl-field-status">{this.props.errorState[this.props.fieldName]}</div>
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
            (this.props.instructionText) ? `${this.props.id}-label ${this.props.id}-status` : null
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
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  fieldName: React.PropTypes.string.isRequired,
  errorState: React.PropTypes.shape(),
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
  className: React.PropTypes.string,
  isRequired: React.PropTypes.bool,
  handleOnChange: React.PropTypes.func,
  checked: React.PropTypes.bool,
  instructionText: React.PropTypes.string,
  maxLength: React.PropTypes.number,
  onBlur: React.PropTypes.func,
  childRef: React.PropTypes.func,
};

FormField.defaultProps = {
  className: '',
  value: '',
  isRequired: false,
  errorState: {},
};
export default FormField;
