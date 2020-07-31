import React from "react";
import {
  Label,
  Input,
  InputTypes,
  HelperErrorText,
} from "@nypl/design-system-react-components";

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
  instructionText?: string;
  maxLength?: number;
  onBlur?: any;
  childRef?: any;
}

class FormField extends React.Component<FormFieldProps> {
  static defaultProps = {
    className: "",
    value: "",
    isRequired: false,
    errorState: {},
  };

  render() {
    const errorText = this.props.errorState[this.props.fieldName];
    let helperText = this.props.instructionText || null;
    let isError = false;
    if (this.props.errorState && errorText) {
      isError = true;
      helperText = errorText;
    }
    const ariaLabelledby = helperText ? `${this.props.id}-helperText` : "";

    return (
      <div className={this.props.className}>
        <Label
          htmlFor={`input-${this.props.id}`}
          id={`${this.props.id}-label`}
          optReqFlag={this.props.isRequired ? "Required" : ""}
        >
          <span>{this.props.label}</span>
        </Label>
        <Input
          value={this.props.value}
          type={InputTypes.text}
          id={this.props.id}
          aria-required={this.props.isRequired}
          aria-labelledby={`${this.props.id}-label ${ariaLabelledby}`}
          attributes={{
            onChange: this.props.handleOnChange,
            maxLength: this.props.maxLength || null,
            onBlur: this.props.onBlur,
            tabIndex: 0,
          }}
          ref={this.props.childRef}
        />
        <HelperErrorText id={`${this.props.id}-helperText`} isError={isError}>
          {helperText}
        </HelperErrorText>
      </div>
    );
  }
}

export default FormField;
