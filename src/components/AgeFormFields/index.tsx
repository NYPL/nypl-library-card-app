import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";

import FormField from "../FormField";
import { isDate } from "../../utils/formDataUtils";
import useFormDataContext from "../../context/FormDataContext";
import moment from "moment";

/**
 * AgeForm
 * Renders an input field for "webApplicant" policy types and a checkbox for
 * "simplye" policy types.
 */
const AgeForm = () => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const DATE_MAX_LENGTH = 10;

  const validateBirthdate = (inputDate: string) => {
    if (!inputDate) return true;
    if (inputDate.length > DATE_MAX_LENGTH || !isDate(inputDate)) {
      return t("personal.errorMessage.birthdate");
    }

    const birthDate = moment(inputDate, "MM/DD/YYYY", true);
    const thirteenYearsAgo = moment().subtract(13, "years");

    if (birthDate.isAfter(thirteenYearsAgo)) {
      return t("personal.errorMessage.ageGate");
    }
    return true;
  };

  const birthdateField = (
    <FormField
      id="birthdate"
      instructionText={t("personal.birthdate.instruction")}
      label={t("personal.birthdate.label")}
      {...register("birthdate", {
        required: t("personal.errorMessage.birthdate"),
        validate: validateBirthdate,
      })}
      isRequired
      errorState={errors}
      maxLength={DATE_MAX_LENGTH}
      defaultValue={formValues.birthdate}
      autoComplete="bday"
    />
  );

  return birthdateField;
};

export default AgeForm;
