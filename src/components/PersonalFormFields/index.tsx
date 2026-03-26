import {
  Checkbox,
  FormField as DSFormField,
  FormRow,
  Link as DSLink,
  TextInputRefType,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { isEmail } from "validator";

import FormField from "../FormField";
import AgeFormFields from "../AgeFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { useMergedRef } from "../../hooks/useMergedRef";
import { Trans } from "../Trans";

interface PersonalFormFieldsProps {
  agencyType?: string;
  id?: string;
  firstFieldRef?: React.RefObject<TextInputRefType>;
}
function PersonalFormFields({
  id = "",
  firstFieldRef,
}: PersonalFormFieldsProps) {
  const { t } = useTranslation("common");
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;

  const { ref: firstNameRegisterRef, ...firstNameRegisterProps } = register(
    "firstName",
    { required: t("personal.errorMessage.firstName") }
  );
  const mergedRef = useMergedRef(firstNameRegisterRef, firstFieldRef);

  return (
    <>
      <FormRow id={`${id}-personalForm-1`}>
        <DSFormField>
          <FormField
            id="firstName"
            label={t("personal.firstName.label")}
            {...firstNameRegisterProps}
            isRequired
            errorState={errors}
            defaultValue={formValues.firstName}
            autoComplete="given-name"
            ref={mergedRef}
          />
        </DSFormField>
        <DSFormField>
          <FormField
            id="lastName"
            label={t("personal.lastName.label")}
            {...register("lastName", {
              required: t("personal.errorMessage.lastName"),
            })}
            isRequired
            errorState={errors}
            defaultValue={formValues.lastName}
            autoComplete="family-name"
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-2`}>
        <DSFormField>
          <AgeFormFields />
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
            type="email"
            defaultValue={formValues.email}
            instructionText={
              <Trans
                i18nKey="personal.email.instruction"
                components={{ a: <DSLink variant="external" /> }}
              />
            }
            autoComplete="email"
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-4`}>
        <DSFormField>
          <Controller
            name="ecommunicationsPref"
            control={control}
            defaultValue={formValues.ecommunicationsPref}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                id="eCommunications"
                isChecked={value}
                labelText={t("personal.eCommunications.labelText")}
                onChange={(e) => onChange(e.target.checked)}
              />
            )}
          />
        </DSFormField>
      </FormRow>
    </>
  );
}

export default PersonalFormFields;
