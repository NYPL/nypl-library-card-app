import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormField from "../FormField";
import UsernameValidationFormFields from "../UsernameValidationFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";
import { Checkbox } from "@nypl/design-system-react-components";
import ilsLibraryList from "../../data/ilsLibraryList";
import LibraryListFormFields from "../LibraryListFormFields";

function AccountInformationForm() {
  const { register, errors, getValues } = useFormContext();
  const { state } = useFormDataContext();
  const [showPin, setShowPin] = useState(false);
  const [clientSide, setClientSide] = useState(false);
  const { formValues } = state;
  const originalPin = getValues("pin");

  const checkBoxLabelOptions = {
    id: "showPinId",
    labelContent: <>Show PIN</>,
  };
  const update = () => setShowPin(!showPin);
  const pinType = showPin ? "text" : "password";

  // When the component renders on the client-side, we want to turn the password
  // "text" input into a "password" type so that the PIN is visible by default.
  // Keep track when it's rendering on the client so that the "Show PIN"
  // checkbox is rendered as well - it's not needed without javascript since
  // you can't toggle without javascript.
  useEffect(() => {
    setClientSide(true);
    setShowPin(false);
  }, []);

  return (
    <>
      <UsernameValidationFormFields errorMessage={errorMessages.username} />

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

      {clientSide && (
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
      )}

      <LibraryListFormFields libraryList={ilsLibraryList} />
    </>
  );
}

export default AccountInformationForm;
