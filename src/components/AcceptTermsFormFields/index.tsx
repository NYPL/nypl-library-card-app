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
const AcceptTermsForm = () => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const { register, errors } = useFormContext();

  return (
    <>
      <p>
        By submitting an application, you understand and agree to our{" "}
        <a href="https://www.nypl.org/help/library-card/terms-conditions">
          Cardholder Terms and Conditions
        </a>{" "}
        and agree to our{" "}
        <a href="https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations">
          Rules and Regulations
        </a>
        . To learn more about the Library’s use of personal information, please
        read our{" "}
        <a href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>

      <Checkbox
        id="acceptTerms"
        invalidText={errors?.acceptTerms?.message}
        isChecked={formValues.acceptTerms}
        isInvalid={errors?.acceptTerms?.message}
        name="acceptTerms"
        labelText={t("account.termsAndCondition")}
        // Users must click the checkbox in order to submit.
        ref={register({
          required: "The Terms and Conditions must be checked.",
        })}
      />
    </>
  );
};

export default AcceptTermsForm;
