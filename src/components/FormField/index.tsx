import React from "react";
import {
  Label,
  Input,
  InputTypes,
  HelperErrorText,
} from "@nypl/design-system-react-components";
import styles from "./FormField.module.css";

interface FormFieldProps {
  id?: string;
  label?: string;
  type?: string;
  name: string;
  errorState?: {};
  className?: string;
  isRequired?: boolean;
  instructionText?: string | JSX.Element;
  minLength?: number;
  maxLength?: number;
  defaultValue?: any;
  attributes?: any;
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
      name,
      errorState = {},
      className = "",
      isRequired = false,
      instructionText,
      minLength,
      maxLength,
      defaultValue,
      // any extra input element attributes
      attributes,
    },
    ref
  ) => {
    const errorText = errorState[name];
    const typeToInputTypeMap = {
      text: InputTypes.text,
      password: InputTypes.password,
      radio: InputTypes.radio,
      hidden: InputTypes.hidden,
    };
    let helperText = instructionText || null;

    if (errorText?.message) {
      helperText = errorText.message;
    }
    const ariaLabelledby = helperText ? `${id}-helperText` : "";
    if (type === "hidden") {
      return (
        <Input
          id={id}
          type={typeToInputTypeMap[type]}
          attributes={{
            defaultValue,
            name,
          }}
          ref={ref}
        />
      );
    }

    return (
      <div className={`${styles.formField} ${className}`}>
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
            tabIndex: 0,
            defaultValue,
            name,
            ...attributes,
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
