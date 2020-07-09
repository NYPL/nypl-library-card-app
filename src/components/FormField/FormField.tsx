import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  fieldName: string;
  errorState?: any;
  value: any;
  className?: string;
  isRequired?: boolean;
  handleOnChange?: any;
  checked?: boolean;
  instructionText?: string;
  maxLength?: number;
  onBlur?: any;
  childRef?: any;
};

class FormField extends React.Component<FormFieldProps> {
  static defaultProps = {
    className: '',
    value: '',
    isRequired: false,
    errorState: {},
  }

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
          tabIndex={0}
        />
        {underInputSuggestion}
      </div>
    );
  }
}

export default FormField;
