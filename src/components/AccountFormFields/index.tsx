import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormField from "../FormField";
import UsernameValidationFormFields from "../UsernameValidationFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";
import { Checkbox } from "@nypl/design-system-react-components";
import ilsLibraryList from "../../data/ilsLibraryList";
import LibraryListFormFields from "../LibraryListFormFields";

interface AccountFormFieldsProps {
  showPinOnLoad?: boolean;
}

function AccountFormFields({ showPinOnLoad }: AccountFormFieldsProps) {
  const { register, errors, getValues } = useFormContext();
  const { state } = useFormDataContext();
  const [showPin, setShowPin] = useState(true);
  const [clientSide, setClientSide] = useState(false);
  const { formValues } = state;
  const originalPin = getValues("pin");

  // When the component loads, if we want to show the PIN by default,
  // show it.
  useEffect(() => {
    if (showPinOnLoad) {
      setShowPin(true);
    }
  }, []);
  const checkBoxLabelOptions = {
    id: "showPinId",
    labelContent: <>Show PIN</>,
  };
  const update = () => setShowPin(!showPin);
  const pinType = showPin ? "text" : "password";
  const pinInstructionText = (
    <p>
      Your PIN must be 4 numbers and must <b>not</b> contain common patterns:
      <br />A number that is repeated 3 or more times (0001, 5555)
      <br />A pair of numbers that is repeated (1212, 6363)
    </p>
  );

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
        name="pin"
        instructionText={pinInstructionText}
        isRequired
        errorState={errors}
        maxLength={4}
        attributes={{
          pattern: "[0-9]{4}",
        }}
        ref={register({
          validate: (val) => val.length === 4 || errorMessages.pin,
        })}
        defaultValue={formValues.pin}
      />

      <FormField
        id="verifyPin"
        type={pinType}
        label="Verify PIN"
        name="verifyPin"
        instructionText="4 digits"
        isRequired
        errorState={errors}
        maxLength={4}
        attributes={{
          pattern: "[0-9]{4}",
        }}
        ref={register({
          validate: (val) =>
            (val.length === 4 && val === originalPin) ||
            errorMessages.verifyPin,
        })}
        defaultValue={formValues.verifyPin}
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

export default AccountFormFields;
