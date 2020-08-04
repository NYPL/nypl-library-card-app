/* eslint-disable */
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
  errorState?: {};
  className?: string;
  isRequired?: boolean;
  instructionText?: string;
  maxLength?: number;
}

/**
 * FormField
 * Renders a complete form field that includes a label, input, and helper text
 * which also renders errors. Internal components are rendered by the
 * NYPL Design System.
 */
const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      type,
      fieldName,
      errorState = {},
      className = "",
      isRequired = false,
      instructionText,
      maxLength,
    },
    ref
  ) => {
    const errorText = errorState[fieldName];
    let helperText = instructionText || null;

    if (errorText?.message) {
      helperText = errorText.message;
    }
    const ariaLabelledby = helperText ? `${id}-helperText` : "";
    return (
      <div className={className}>
        <Label
          htmlFor={`input-${id}`}
          id={`${id}-label`}
          optReqFlag={isRequired ? "Required" : ""}
        >
          <span>{label}</span>
        </Label>
        <Input
          type={InputTypes.text}
          id={id}
          aria-required={isRequired}
          aria-labelledby={`${id}-label ${ariaLabelledby}`}
          attributes={{
            ["aria-invalid"]: errorText ? "true" : "false",
            maxLength: maxLength || null,
            name: fieldName,
            tabIndex: 0,
          }}
          ref={ref}
        />
        <HelperErrorText id={`${id}-helperText`} isError={!!errorText}>
          {helperText}
        </HelperErrorText>
      </div>
    );
  }
);

export default FormField;