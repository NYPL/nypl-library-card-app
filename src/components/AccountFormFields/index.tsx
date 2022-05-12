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
  showPasswordOnLoad?: boolean;
}

function AccountFormFields({ showPasswordOnLoad }: AccountFormFieldsProps) {
  const { register, errors, getValues } = useFormContext();
  const { state } = useFormDataContext();
  const [showPassword, setShowPassword] = useState(true);
  const [clientSide, setClientSide] = useState(false);
  const { formValues } = state;
  const originalPassword = getValues("password");

  // When the component loads, if we want to show the password by default,
  // show it.
  useEffect(() => {
    if (showPasswordOnLoad) {
      setShowPassword(true);
    }
  }, []);
  const checkBoxLabelOptions = {
    id: "showPasswordId",
    labelContent: <>Show Password</>,
  };
  const minPasswordLength = 8;
  const maxPasswordLength = 32;
  const update = () => setShowPassword(!showPassword);
  const passwordType = showPassword ? "text" : "password";
  const passwordInstructionText = (
    <p>
      We encourage you to select a strong password that includes: at least 8
      characters, a mixture of uppercase and lowercase letters, a mixture of
      letters and numbers, and at least one special character <i>except</i>{" "}
      period (.)
      <br />
      Example: MyLib1731@
      <br />
      Password cannot contain common patterns such as consecutively repeating a
      character three or more times, e.g. aaaatf54 or repeating a pattern, e.g.
      abcabcab
    </p>
  );

  // When the component renders on the client-side, we want to turn the password
  // "text" input into a "password" type so that the password is visible by default.
  // Keep track when it's rendering on the client so that the "Show Password"
  // checkbox is rendered as well - it's not needed without javascript since
  // you can't toggle without javascript.
  useEffect(() => {
    setClientSide(true);
    setShowPassword(false);
  }, []);

  // Note: As of 1/22, the password must not contain a period to allow
  // patrons to log into Overdrive for digital reading.
  const validatePassword = (val) => {
    return (
      val.length >= minPasswordLength &&
      val.length <= maxPasswordLength &&
      val.indexOf(".") === -1
    );
  };

  return (
    <>
      <UsernameValidationFormFields errorMessage={errorMessages.username} />

      <FormField
        id="password"
        type={passwordType}
        label="Password"
        name="password"
        instructionText={passwordInstructionText}
        isRequired
        errorState={errors}
        minLength={minPasswordLength}
        maxLength={maxPasswordLength}
        ref={register({
          validate: (val) => validatePassword(val) || errorMessages.password,
        })}
        defaultValue={formValues.password}
      />

      <FormField
        id="verifyPassword"
        type={passwordType}
        label="Verify Password"
        name="verifyPassword"
        instructionText="8-32 characters"
        isRequired
        errorState={errors}
        minLength={minPasswordLength}
        maxLength={maxPasswordLength}
        ref={register({
          validate: (val) =>
            val === originalPassword || errorMessages.verifyPassword,
        })}
        defaultValue={formValues.verifyPassword}
      />

      {clientSide && (
        <Checkbox
          id="showPassword"
          name="showPassword"
          labelText={checkBoxLabelOptions.labelContent}
          isChecked={showPassword}
          onChange={update}
        />
      )}

      <LibraryListFormFields libraryList={ilsLibraryList} />
    </>
  );
}

export default AccountFormFields;
