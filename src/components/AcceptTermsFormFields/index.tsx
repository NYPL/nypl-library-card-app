import { Checkbox } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React from "react";
import { useFormContext } from "react-hook-form";

import useFormDataContext from "../../context/FormDataContext";

/**
 * AcceptTermsForm
 * Renders a checkbox that users must click on in order to submit the form.
 * This is based on `react-hook-form` and its `register` function to handle
 * the state of the checkbox. The parent component must use `react-hook-form`
 * to get the value and trigger updates.
 */
const AcceptTermsForm: React.FC = () => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const { register, errors } = useFormContext();

  return (
    <>
      <p
        dangerouslySetInnerHTML={{
          __html: t("account.termsAndCondition.text"),
        }}
      />

      <Checkbox
        id="acceptTerms"
        invalidText={t("account.errorMessage.acceptTerms")}
        isChecked={formValues.acceptTerms}
        isInvalid={errors?.acceptTerms?.message}
        name="acceptTerms"
        labelText={t("account.termsAndCondition.label")}
        // Users must click the checkbox in order to submit.
        ref={register({
          required: t("account.errorMessage.acceptTerms"),
        })}
      />
    </>
  );
};

export default AcceptTermsForm;
