import {
  Box,
  Button,
  ButtonGroup,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { isAlphanumeric } from "validator";

import FormField from "../FormField";
import useFormDataContext from "../../context/FormDataContext";

import {
  apiErrorTranslations,
  commonAPIErrors,
} from "../../data/apiErrorMessageTranslations";
import { apiTranslations } from "../../data/apiMessageTranslations";
import { NRError } from "../../logger/newrelic";

interface UsernameValidationFormProps {
  id?: string;
  errorMessage?: string;
  csrfToken: string;
}

/**
 * UsernameValidationForm
 * Renders the input field for the username value. It also renders a button for
 * optional request to check if the username is available.
 */
const UsernameValidationForm = ({
  id = "",
  errorMessage = "",
  csrfToken,
}: UsernameValidationFormProps) => {
  const { t } = useTranslation("common");
  const {
    query: { lang = "en" },
  } = useRouter();
  const defaultState = {
    available: false,
    message: "",
  };
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(defaultState);
  const {
    watch,
    getValues,
    register,
    formState: { errors },
  } = useFormContext();
  const usernameWatch = watch("username");
  const { state } = useFormDataContext();
  const { formValues } = state;

  // Whenever the username input changes, revert back to the default state.
  // This is to re-render the button after a patron tries a new username.
  useEffect(() => {
    setUsernameIsAvailable(defaultState);
  }, [usernameWatch]);

  /**
   * validateUsername
   * Call the API to validate the username and either get an available username
   * response or an error response that the username is unavailable or invalid.
   */
  const validateUsername = (e) => {
    e.preventDefault();
    const username = getValues("username");
    axios
      .post("/library-card/api/username", { username, csrfToken })
      .then((response) => {
        let message = response.data?.message;
        // Translate the message if possible.
        if (lang !== "en") {
          message = apiTranslations[message][lang] || message;
        }
        setUsernameIsAvailable({
          available: true,
          message,
        });
      })
      .catch((error) => {
        let message = error.response?.data?.message;
        // Catch any CSRF token issues and return a generic error message.
        if (error.response.status == 403) {
          message = commonAPIErrors.errorValidatingToken;
        }
        // If the server is down, return a server error message.
        if (error.response.status === 500) {
          message = commonAPIErrors.errorValidatingUsername;
        }

        // Translate the message if possible.
        if (lang !== "en") {
          message = apiErrorTranslations[message][lang] || message;
        }

        NRError(
          new Error(`Error Validate Username. ${JSON.stringify(error)}`),
          {
            customAttributes: {
              contactForm: `Error Validate Username. ${JSON.stringify(error)}`,
            },
          }
        );

        setUsernameIsAvailable({
          available: false,
          message,
        });
      });
  };
  const inputValidation = (value = "") =>
    value.length >= 5 && value.length <= 25 && isAlphanumeric(value);
  /**
   * renderButton
   * Render the button to validate a username and enable it only if
   * the input is valid and if the input has been updated after it
   * was checked for availability.
   */
  const renderButton = () => {
    const username = getValues("username");
    const canValidate =
      inputValidation(username) && !usernameIsAvailable.message;
    return (
      <ButtonGroup>
        <Button
          id="username-check-button"
          isDisabled={!canValidate}
          onClick={validateUsername}
          type="button"
        >
          {t("account.username.checkButton")}
        </Button>
      </ButtonGroup>
    );
  };

  return (
    <>
      <FormRow id={`${id}-username-1`}>
        <DSFormField>
          <FormField
            id="username"
            label={t("account.username.label")}
            {...register("username", {
              validate: (val) => inputValidation(val) || errorMessage,
            })}
            instructionText={t("account.username.instruction")}
            isRequired
            errorState={errors}
            maxLength={25}
            defaultValue={formValues.username}
            autoComplete="username"
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-username-2`}>
        <DSFormField>{renderButton()}</DSFormField>
      </FormRow>

      <FormRow
        id={`${id}-username-3`}
        display={usernameIsAvailable?.message ? "block" : "contents"}
      >
        <DSFormField
          aria-live="assertive"
          display={usernameIsAvailable?.message ? "block" : "contents"}
        >
          {usernameIsAvailable?.message ? (
            <Box
              color={
                usernameIsAvailable.available
                  ? "var(--nypl-colors-ui-success-primary)"
                  : "var(--nypl-colors-ui-error-primary)"
              }
            >
              {usernameIsAvailable.message}
            </Box>
          ) : null}
        </DSFormField>
      </FormRow>
    </>
  );
};

export default UsernameValidationForm;
