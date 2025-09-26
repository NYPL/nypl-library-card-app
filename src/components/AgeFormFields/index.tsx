/* eslint-disable @typescript-eslint/no-unused-vars */

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
const AgeForm = ({ policyType = "webApplicant" }: AgeFormProps) => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const DATE_MAX_LENGTH = 10;

  const birthdateField = (
    <FormField
      id="birthdate"
      instructionText={t("personal.birthdate.instruction")}
      label={t("personal.birthdate.label")}
      {...register("birthdate", {
        required: t("personal.errorMessage.birthdate"),
        validate: (val) =>
          (val.length <= DATE_MAX_LENGTH && isDate(val)) ||
          t("personal.errorMessage.birthdate"),
      })}
      isRequired
      errorState={errors}
      maxLength={DATE_MAX_LENGTH}
      defaultValue={formValues.birthdate}
    />
  );

  return birthdateField;
};

export default AgeForm;
