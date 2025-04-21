import {
  Checkbox,
  FormRow,
  FormField as DSFormField,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import FormField from "../FormField";
import UsernameValidationFormFields from "../UsernameValidationFormFields";
import useFormDataContext from "../../context/FormDataContext";
import ilsLibraryList from "../../data/ilsLibraryList";
import LibraryListFormFields from "../LibraryListFormFields";

interface AccountFormFieldsProps {
  id?: string;
  showPasswordOnLoad?: boolean;
  csrfToken: string;
}

function AccountFormFields({
  id,
  showPasswordOnLoad,
  csrfToken,
}: AccountFormFieldsProps) {
  const { t } = useTranslation("common");
  const { register, errors, getValues } = useFormContext();
  const { state } = useFormDataContext();
  const [showPassword, setShowPassword] = useState(true);
  const [clientSide, setClientSide] = useState(false);
  const { formValues } = state;

  // When the component loads, if we want to show the password by default,
  // show it.
  useEffect(() => {
    if (showPasswordOnLoad) {
      setShowPassword(true);
    }
  }, []);
  const minPasswordLength = 8;
  const maxPasswordLength = 32;
  const update = () => setShowPassword(!showPassword);
  const passwordType = showPassword ? "text" : "password";

  // When the component renders on the client-side, we want to turn the password
  // "text" input into a "password" type so that the password is visible by default.
  // Keep track when it's rendering on the client so that the "Show Password"
  // checkbox is rendered as well - it's not needed without javascript since
  // you can't toggle without javascript.
  useEffect(() => {
    setClientSide(true);
    setShowPassword(false);
  }, []);

  const validatePasswordLength = (val) => {
    return (
      (val.length >= minPasswordLength && val.length <= maxPasswordLength) ||
      t("account.errorMessage.password")
    );
  };
  const verifyPasswordmatch = () => {
    return (
      getValues("password") === getValues("verifyPassword") ||
      t("account.errorMessage.verifyPassword")
    );
  };

  return (
    <>
      <UsernameValidationFormFields
        id={`${id}-accountForm-1`}
        errorMessage={t("account.errorMessage.username")}
        csrfToken={csrfToken}
      />

      <FormRow id={`${id}-accountForm-2`}>
        <DSFormField>
          <FormField
            id="password"
            type={passwordType}
            label={t("account.password.label")}
            name="password"
            instructionText={t("account.password.instruction")}
            isRequired
            errorState={errors}
            minLength={minPasswordLength}
            maxLength={maxPasswordLength}
            ref={register({
              validate: {
                validatePasswordLength,
                verifyPasswordmatch,
              },
            })}
            defaultValue={formValues.password}
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-accountForm-3`}>
        <DSFormField>
          <FormField
            id="verifyPassword"
            type={passwordType}
            label={t("account.verifyPassword.label")}
            name="verifyPassword"
            instructionText={t("account.verifyPassword.instruction")}
            isRequired
            errorState={errors}
            minLength={minPasswordLength}
            maxLength={maxPasswordLength}
            ref={register({
              validate: verifyPasswordmatch,
            })}
            defaultValue={formValues.verifyPassword}
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-accountForm-4`}>
        <DSFormField>
          {clientSide && (
            <Checkbox
              id="showPassword"
              isChecked={showPassword}
              labelText={t("account.showPassword")}
              name="showPassword"
              onChange={update}
            />
          )}
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-accountForm-5`}>
        <DSFormField>
          <LibraryListFormFields libraryList={ilsLibraryList} />
        </DSFormField>
      </FormRow>
    </>
  );
}

export default AccountFormFields;
