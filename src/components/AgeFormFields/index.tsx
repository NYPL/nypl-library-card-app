/* eslint-disable @typescript-eslint/no-unused-vars */
import { Checkbox } from "@nypl/design-system-react-components";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";

import FormField from "../FormField";
import { isDate } from "../../utils/formDataUtils";
import useFormDataContext from "../../context/FormDataContext";

interface AgeFormProps {
  policyType?: string;
}

/**
 * AgeForm
 * Renders an input field for "webApplicant" policy types and a checkbox for
 * "simplye" policy types.
 */
const AgeForm = ({
  policyType = "webApplicant",
}: AgeFormProps): React.ReactElement => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const { register, errors } = useFormContext();
  const MAXLENGTHDATE = 10;
  // TODO: Right now, all applicants are web applications and
  // this feature is not needed. Setting to true.
  // const isWebApplicant = policyType === "webApplicant";
  const isWebApplicant = true;
  const ageGateError = errors?.ageGate?.message;

  const birthdateField = (
    <FormField
      id="birthdate"
      instructionText={`${t("personal.birthdate.instruction.part1")} <br/>
      ${t("personal.birthdate.instruction.part2")}`}
      label={t("personal.birthdate.label")}
      name="birthdate"
      isRequired
      errorState={errors}
      maxLength={MAXLENGTHDATE}
      // This `validate` callback allows for specific validation
      ref={register({
        validate: (val) =>
          (val.length <= MAXLENGTHDATE && isDate(val)) ||
          t("personal.errorMessage.birthdate"),
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
        labelText={t("personal.ageGate")}
        ref={register({
          required: t("personal.errorMessage.ageGate"),
        })}
      />
    </>
  );

  return isWebApplicant ? birthdateField : ageGateField;
};

export default AgeForm;
