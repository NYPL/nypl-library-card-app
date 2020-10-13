import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import FormField from "../FormField";
import UsernameValidationForm from "../UsernameValidationForm";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";
import { Checkbox } from "@nypl/design-system-react-components";

function AccountInformationForm() {
  const { register, errors, getValues } = useFormContext();
  const { state } = useFormDataContext();
  const [showPin, setShowPin] = useState(false);
  const { formValues } = state;
  const originalPin = getValues("pin");

  const checkBoxLabelOptions = {
    id: "showPinId",
    labelContent: <>Show PIN</>,
  };
  const update = () => setShowPin(!showPin);
  const pinType = showPin ? "text" : "password";

  return (
    <>
      <UsernameValidationForm errorMessage={errorMessages.username} />

      <FormField
        id="pin"
        type={pinType}
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

      <FormField
        id="verifyPin"
        type={pinType}
        label="Verify PIN"
        fieldName="verifyPin"
        instructionText="4 digits"
        isRequired
        errorState={errors}
        maxLength={4}
        ref={register({
          validate: (val) =>
            (val.length === 4 && val === originalPin) ||
            errorMessages.verifyPin,
        })}
        defaultValue={formValues.pin}
      />

      <Checkbox
        checkboxId="showPIN"
        name="showPIN"
        labelOptions={checkBoxLabelOptions}
        isSelected={false}
        attributes={{
          defaultChecked: showPin,
          onClick: update,
        }}
      />
    </>
  );
}

export default AccountInformationForm;
