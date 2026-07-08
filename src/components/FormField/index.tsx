import React, { JSX } from "react";
import { useTranslation } from "next-i18next";
import {
  TextInput,
  TextInputTypes,
  TextInputRefType,
  AutoCompleteValues,
} from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  id: string;
  label?: string;
  type?: string;
  name: string;
  inputMode?: string;
  errorState?: any;
  className?: string;
  isRequired?: boolean;
  instructionText?: string | JSX.Element;
  minLength?: number;
  maxLength?: number;
  defaultValue?: any;
  attributes?: any;
  pattern?: any;
  autoComplete?:
    | AutoCompleteValues
    | "section-home address-line1"
    | "section-home address-line2"
    | "section-home address-level2"
    | "section-home address-level1"
    | "section-home postal-code"
    | "section-work address-line1"
    | "section-work address-line2"
    | "section-work address-level2"
    | "section-work address-level1"
    | "section-work postal-code";
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
      inputMode = "text",
      errorState = {},
      className = "",
      isRequired = false,
      instructionText,
      minLength,
      maxLength,
      defaultValue,
      autoComplete,
      attributes = {},
      ...rest
    },
    ref
  ) => {
    const formMethods = useFormContext();
    const { onChange: registeredOnChange, ...restProps } = rest as {
      onChange?: (event: any) => void;
    };

    const handleChange = (event: any) => {
      formMethods?.clearErrors?.(name);
      registeredOnChange?.(event);
    };

    const errorText = errorState[name];
    const typeToInputTypeMap = {
      text: "text",
      password: "password",
      email: "email",
      hidden: "hidden",
    };
    let helperText = instructionText || null;
    const { t } = useTranslation("common");

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
          autoComplete={autoComplete as AutoCompleteValues}
          onChange={handleChange}
          {...restProps}
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
          requiredLabelText={t("required")}
          helperText={helperText}
          invalidText={helperText}
          min={minLength || null}
          max={maxLength || null}
          defaultValue={defaultValue}
          name={name}
          inputMode={inputMode}
          labelText={label}
          {...attributes}
          ref={ref} // pass directly
          autoComplete={autoComplete}
          onChange={handleChange}
          {...restProps}
        />
      </div>
    );
  }
);

export default FormField;
