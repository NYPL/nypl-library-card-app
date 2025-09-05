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
  const MAXLENGTHDATE = 10;
  // TODO: Right now, all applicants are web applications and
  // this feature is not needed. Only rendering the `birthdateField`
  // for now (11/1/22).
  // const isWebApplicant = policyType === "webApplicant";
  // const ageGateError = errors?.ageGate?.message;

  const birthdateField = (
    <FormField
      id="birthdate"
      instructionText={t("personal.birthdate.instruction")}
      label={t("personal.birthdate.label")}
      {...register("birthdate", {
        required: t("personal.errorMessage.birthdate"),
        validate: (val) =>
          (val.length <= MAXLENGTHDATE && isDate(val)) ||
          t("personal.errorMessage.birthdate"),
      })}
      isRequired
      errorState={errors}
      maxLength={MAXLENGTHDATE}
      defaultValue={formValues.birthdate}
    />
  );
  // TODO: Use this later for non-webApplicant policy types.
  // const ageGateField = (
  //   <>
  //     <Checkbox
  //       id="ageGateCheckbox"
  //       invalidText={ageGateError}
  //       isChecked={formValues.ageGate}
  //       isInvalid={ageGateError}
  //       name="ageGate"
  //       labelText={t("personal.ageGate")}
  //       ref={register({
  //         required: t("personal.errorMessage.ageGate"),
  //       })}
  //     />
  //   </>
  // );

  return birthdateField;
};

export default AgeForm;
