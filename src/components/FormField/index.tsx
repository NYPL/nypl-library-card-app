/* eslint-disable */
import React from "react";
import {
  Label,
  Input,
  InputTypes,
  HelperErrorText,
  Checkbox,
} from "@nypl/design-system-react-components";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  fieldName: string;
  errorState?: {};
  className?: string;
  isRequired?: boolean;
  instructionText?: string;
  minLength?: number;
  maxLength?: number;
  defaultValue?: any;
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
      type = "text",
      fieldName,
      errorState = {},
      className = "",
      isRequired = false,
      instructionText,
      minLength,
      maxLength,
      defaultValue,
      // any extra input element attributes
      ...rest
    },
    ref
  ) => {
    const errorText = errorState[fieldName];
    const typeToInputTypeMap = {
      text: InputTypes.text,
      password: InputTypes.password,
      radio: InputTypes.radio,
    };
    let helperText = instructionText || null;

    if (errorText?.message) {
      helperText = errorText.message;
    }
    const ariaLabelledby = helperText ? `${id}-helperText` : "";

    if (type === "hidden") {
      return (
        <input
          type="hidden"
          aria-hidden={true}
          name={fieldName}
          defaultValue={defaultValue}
          ref={ref}
        />
      );
    }
    return (
      <div className={`form-field ${className}`}>
        <Label
          htmlFor={`input-${id}`}
          id={`${id}-label`}
          optReqFlag={isRequired ? "Required" : ""}
        >
          {label}
        </Label>
        <Input
          type={typeToInputTypeMap[type]}
          id={id}
          aria-required={isRequired}
          aria-labelledby={`${id}-label ${ariaLabelledby}`}
          attributes={{
            ["aria-invalid"]: errorText ? "true" : "false",
            minLength: minLength || null,
            maxLength: maxLength || null,
            name: fieldName,
            tabIndex: 0,
            defaultValue,
            ...rest,
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
