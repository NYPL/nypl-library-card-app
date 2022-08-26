import React from "react";
import {
  TextInput,
  TextInputTypes,
  TextInputRefType,
} from "@nypl/design-system-react-components";

interface FormFieldProps {
  id: string;
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
      hidden: "hidden",
    };
    let helperText = instructionText || null;

    if (errorText?.message) {
      helperText = errorText.message;
    }
    if (type === "hidden") {
      return (
        <TextInput
          defaultValue={defaultValue}
          id={id}
          name={name}
          labelText={label}
          ref={ref}
          type={typeToInputTypeMap[type] as TextInputTypes}
        />
      );
    }

    return (
      <div className={className}>
        <TextInput
          type={typeToInputTypeMap[type] as TextInputTypes}
          id={id}
          isInvalid={!!errorText}
          isRequired={isRequired}
          helperText={helperText}
          invalidText={helperText}
          min={minLength || null}
          max={maxLength || null}
          defaultValue={defaultValue}
          name={name}
          labelText={label}
          {...attributes}
          ref={ref}
        />
      </div>
    );
  }
);

export default FormField;
