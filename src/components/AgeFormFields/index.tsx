import React from "react";
import { Checkbox } from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";
import FormField from "../FormField";
import { isDate } from "../../utils/formDataUtils";
import useFormDataContext from "../../context/FormDataContext";

interface AgeFormProps {
  policyType?: string;
  errorMessages: any;
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
  const { state } = useFormDataContext();
  const { formValues } = state;
  const { register, errors } = useFormContext();
  const MAXLENGTHDATE = 10;
  const isWebApplicant = policyType === "webApplicant";
  const ageGateError = errors?.ageGate?.message;

  const birthdateField = (
    <FormField
      id="birthdate"
      instructionText="MM/DD/YYYY, including slashes"
      label="Date of Birth"
      name="birthdate"
      isRequired
      errorState={errors}
      maxLength={MAXLENGTHDATE}
      // This `validate` callback allows for specific validation
      ref={register({
        validate: (val) =>
          (val.length <= MAXLENGTHDATE && isDate(val)) ||
          errorMessages["birthdate"],
      })}
      defaultValue={formValues.birthdate}
    />
  );
  const ageGateField = (
    <>
      <Checkbox
        id="ageGateCheckbox"
        invalidText={ageGateError}
        isChecked={formValues.ageGate}
        isInvalid={ageGateError}
        name="ageGate"
        labelText="Yes, I am over 13 years old."
        ref={register({
          required: errorMessages["ageGate"],
        })}
      />
    </>
  );

  return isWebApplicant ? birthdateField : ageGateField;
};

export default AgeForm;
