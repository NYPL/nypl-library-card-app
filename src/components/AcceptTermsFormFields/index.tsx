import { Checkbox, Link as DSLink } from "@nypl/design-system-react-components";
import { Trans, useTranslation } from "next-i18next";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
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
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Paragraph m={0}>
        <Trans
          i18nKey="account.termsAndCondition.text"
          components={{ a: <DSLink variant="external" /> }}
          values={{
            termsConditions: t("account.termsAndCondition.termsConditions"),
            rulesRegulations: t("account.termsAndCondition.rulesRegulations"),
            privacyPolicy: t("account.termsAndCondition.privacyPolicy"),
          }}
        />
      </Paragraph>

      <Controller
        name="acceptTerms"
        control={control}
        defaultValue={false}
        rules={{ required: t("account.errorMessage.acceptTerms") }}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            id="acceptTerms"
            invalidText={t("account.errorMessage.acceptTerms")}
            isInvalid={!!errors?.acceptTerms?.message}
            isChecked={value}
            labelText={t("account.termsAndCondition.label")}
            onChange={(e) => onChange(e.target.checked)}
          />
        )}
      />
    </>
  );
};

export default AcceptTermsForm;
