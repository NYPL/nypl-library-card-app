import { Box, Checkbox } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Paragraph } from "../Paragraph";

/**
 * AcceptTermsForm
 * Renders a checkbox that users must click on in order to submit the form.
 * This is based on `react-hook-form` and its `register` function to handle
 * the state of the checkbox. The parent component must use `react-hook-form`
 * to get the value and trigger updates.
 */
const AcceptTermsForm: React.FC = () => {
  const { t } = useTranslation("common");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Paragraph
        dangerouslySetInnerHTML={{
          __html: t("account.termsAndCondition.text"),
        }}
      />

      <Checkbox
        id="acceptTerms"
        invalidText={t("account.errorMessage.acceptTerms")}
        isInvalid={!!errors?.acceptTerms?.message}
        {...register("acceptTerms", {
          required: t("account.errorMessage.acceptTerms"),
        })}
        labelText={t("account.termsAndCondition.label")}
      />
    </>
  );
};

export default AcceptTermsForm;
