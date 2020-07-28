import React from "react";
import FormField from "./FormField";
import { isDate } from "../utils/FormValidationUtils";
import {
  Checkbox,
  HelperErrorText,
} from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";

interface AgeFormProps {
  policyType?: string;
  errorMessages: {};
}

/**
 * AgeForm
 * Renders an input field for "webApplicant" policy types and a checkbox for
 * "simplye" policy types.
 */
const AgeForm = ({
  policyType = "webApplicant",
  errorMessages,
}: AgeFormProps) => {
  const { register, errors } = useFormContext();
  const MAXLENGTHDATE = 10;
  const isWebApplicant = policyType === "webApplicant";
  const ageGateLabelOptions = {
    id: "ageGateLabel",
    labelContent: <>Yes, I am over 13 years old.</>,
  };
  const ageGateError = errors?.ageGate?.message;

  const birthdateField = (
    <FormField
      id="patronBirthdate"
      className="nypl-date-field"
      type="text"
      instructionText="MM/DD/YYYY, including slashes"
      label="Date of Birth"
      fieldName="birthdate"
      isRequired
      errorState={errors}
      maxLength={MAXLENGTHDATE}
      // This `validate` callback allows for specific validation
      ref={register({
        validate: (val) =>
          (val.length <= MAXLENGTHDATE && isDate(val)) ||
          errorMessages["birthdate"],
      })}
    />
  );
  const ageGateField = (
    <>
      <Checkbox
        checkboxId="ageGateCheckbox"
        name="ageGate"
        labelOptions={ageGateLabelOptions}
        isSelected={false}
        ref={register({
          required: errorMessages["ageGate"],
        })}
      />
      {!!ageGateError && (
        <HelperErrorText isError={true}>{ageGateError}</HelperErrorText>
      )}
    </>
  );

  return isWebApplicant ? birthdateField : ageGateField;
};

export default AgeForm;
