import {
  Checkbox,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
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
}: PersonalFormFieldsProps) {
  const { t } = useTranslation("common");
  const {
    register,
    formState: { errors },
  } = useFormContext();
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
            {...register("firstName", {
              required: t("personal.errorMessage.firstName"),
            })}
            isRequired
            errorState={errors}
            defaultValue={formValues.firstName}
          />
        </DSFormField>
        <DSFormField>
          <FormField
            id="lastName"
            label={t("personal.lastName.label")}
            {...register("lastName", {
              required: "oh no",
            })}
            isRequired
            errorState={errors}
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
            {...register("email", {
              required: t("personal.errorMessage.email"),
              validate: (val) =>
                val === "" || isEmail(val) || t("personal.errorMessage.email"),
            })}
            errorState={errors}
            isRequired
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
            {...register("ecommunicationsPref")}
            onChange={() => setEcommunicationsPref((prev) => !prev)}
          />
        </DSFormField>
      </FormRow>
    </>
  );
}

export default PersonalFormFields;
