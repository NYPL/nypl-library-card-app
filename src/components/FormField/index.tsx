import React from "react";
import {
  TextInput,
  TextInputRefType,
  TextInputTypes,
} from "@nypl/design-system-react-components";
import styles from "./FormField.module.css";

interface FormFieldProps {
  id?: string;
  label?: string;
  type?: string;
  name: string;
  errorState?: any;
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
const FormField = React.forwardRef<TextInputRefType, FormFieldProps>(
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
      text: "text",
      password: "password",
      radio: "radio",
      hidden: "hidden",
    };
    let helperText = instructionText || null;

    if (errorText?.message) {
      helperText = errorText.message;
    }
    const ariaDescribedby = helperText ? `${id}-helperText` : null;
    if (type === "hidden") {
      return (
        <TextInput
          id={id}
          type={typeToInputTypeMap[type] as TextInputTypes}
          defaultValue={defaultValue}
          name={name}
          ref={ref}
          labelText="hidden"
        />
      );
    }

    return (
      <div className={`${styles.formField} ${className}`}>
        <TextInput
          type={typeToInputTypeMap[type]}
          id={id}
          isRequired={isRequired}
          isInvalid={errorText}
          maxLength={maxLength || null}
          defaultValue={defaultValue}
          name={name}
          {...attributes}
          ref={ref}
          labelText={label}
          invalidText={errorText?.message}
        />
      </div>
    );
  }
);

export default FormField;
