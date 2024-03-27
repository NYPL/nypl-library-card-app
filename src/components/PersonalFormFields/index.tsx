import {
  Checkbox,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";

import FormField from "../FormField";
import AgeFormFields from "../AgeFormFields";
import useFormDataContext from "../../context/FormDataContext";

interface PersonalFormFieldsProps {
  agencyType?: string;
  id?: string;
}
function PersonalFormFields({
  agencyType = "",
  id = "",
}: PersonalFormFieldsProps): React.ReactElement {
  const { t } = useTranslation("common");
  const { register, errors } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;
  const [ecommunicationsPref, setEcommunicationsPref] = useState<boolean>(
    formValues.ecommunicationsPref
  );
  return (
    <>
      <FormRow id={`${id}-personalForm-1`}>
        <DSFormField>
          <FormField
            id="firstName"
            label={t("personal.firstName.label")}
            name="firstName"
            isRequired
            // Every input field is registered to react-hook-form. If this
            // field is empty on blur or on submission, the error message will
            // display below the input.
            // NOTE: If/when the react-hook-form module is upgraded to 7.x
            // a refactor of the below line, and those like it, will be
            // required. See https://legacy.react-hook-form.com/migrate-v6-to-v7/
            // https://stackoverflow.com/questions/66927729/ref-register-inside-input-is-giving-me-a-path-split-error
            ref={register({
              required: t("personal.errorMessage.firstName"),
            })}
            errorState={errors}
            defaultValue={formValues.firstName}
          />
        </DSFormField>
        <DSFormField>
          <FormField
            id="lastName"
            label={t("personal.lastName.label")}
            name="lastName"
            isRequired
            errorState={errors}
            ref={register({
              required: t("personal.errorMessage.lastName"),
            })}
            defaultValue={formValues.lastName}
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-2`}>
        <DSFormField>
          <AgeFormFields policyType={agencyType || formValues.policyType} />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-3`}>
        <DSFormField>
          <FormField
            id="email"
            label={t("personal.email.label")}
            name="email"
            errorState={errors}
            isRequired
            ref={register({
              required: t("personal.errorMessage.email"),
              validate: (val) =>
                val === "" || isEmail(val) || t("personal.errorMessage.email"),
            })}
            defaultValue={formValues.email}
            instructionText={t("personal.email.instruction")}
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-4`}>
        <DSFormField>
          <Checkbox
            id="eCommunications"
            isChecked={ecommunicationsPref}
            labelText={t("personal.eCommunications.labelText")}
            name="ecommunicationsPref"
            onChange={() => setEcommunicationsPref((prev) => !prev)}
            ref={register()}
          />
        </DSFormField>
      </FormRow>
    </>
  );
}

export default PersonalFormFields;
