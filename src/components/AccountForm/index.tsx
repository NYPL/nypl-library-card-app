import React from "react";
import { useFormContext } from "react-hook-form";

import FormField from "../FormField";
import UsernameValidationForm from "../UsernameValidationForm";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";

function AccountInformationForm() {
  const { register, errors } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;

  return (
    <>
      <UsernameValidationForm errorMessage={errorMessages.username} />

      <FormField
        id="patronPin"
        type="text"
        label="PIN"
        fieldName="pin"
        instructionText="4 digits"
        isRequired
        errorState={errors}
        maxLength={4}
        ref={register({
          validate: (val) => val.length === 4 || errorMessages.pin,
        })}
        defaultValue={formValues.pin}
      />
    </>
  );
}

export default AccountInformationForm;
