import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAlphanumeric } from "validator";
import { Button } from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";
import FormField from "../FormField";
import useFormDataContext from "../../context/FormDataContext";
import styles from "./UsernameValidationFormFields.module.css";
import { lcaEvents } from "../../externals/gaUtils";

interface UsernameValidationFormProps {
  errorMessage?: string;
}

/**
 * UsernameValidationForm
 * Renders the input field for the username value. It also renders a button for
 * optional request to check if the username is available. If available, a
 * hidden input is rendered with the `usernameHasBeenValidated` flag set to
 * true so that the Card Creator `/patrons` endpoint doesn't have to
 * re-evaluate the username (and make one less request to the NYPL ILS).
 */
const UsernameValidationForm = ({
  errorMessage = "",
}: UsernameValidationFormProps) => {
  const defaultState = {
    available: false,
    message: "",
  };
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(defaultState);
  const { watch, getValues, register, errors } = useFormContext();
  const usernameWatch = watch("username");
  const { state } = useFormDataContext();
  const { formValues, csrfToken } = state;

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
        lcaEvents("Availability Checker", "Username - available");
        setUsernameIsAvailable({
          available: true,
          message: response.data?.message,
        });
      })
      .catch((error) => {
        let message = error.response?.data?.message;
        // Catch any CSRF token issues and return a generic error message.
        if (error.response.status == 403) {
          message = "A server error occurred validating a token.";
        }
        // If the server is down, return a server error message.
        if (error.response.status === 500) {
          message = "Cannot validate usernames at this time.";
        }

        lcaEvents("Availability Checker", "Username - unavailable");
        setUsernameIsAvailable({
          available: false,
          message,
        });
      });
  };
  const inputValidation = (value = "") =>
    value.length >= 5 && value.length <= 25 && isAlphanumeric(value);
  const availableClassname = usernameIsAvailable.available
    ? styles.usernameAvailable
    : styles.usernameUnavailable;

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
      <Button
        id="username-check-button"
        isDisabled={!canValidate}
        onClick={validateUsername}
        type="button"
      >
        Check if username is available
      </Button>
    );
  };

  return (
    <>
      <FormField
        id="username"
        label="Username"
        name="username"
        instructionText="5-25 alphanumeric characters. No special characters."
        isRequired
        errorState={errors}
        maxLength={25}
        ref={register({
          validate: (val) => inputValidation(val) || errorMessage,
        })}
        defaultValue={formValues.username}
      />
      {renderButton()}
      <div
        className={`${styles.usernameHelperText} ${availableClassname}`}
        aria-live="assertive"
      >
        {usernameIsAvailable.message}
      </div>
      {/* Only add this value to the form submission if there is a message. */}
      {usernameIsAvailable.message && (
        <FormField
          id="hidden-username-validated"
          type="hidden"
          name="usernameHasBeenValidated"
          defaultValue={`${usernameIsAvailable.available}`}
          ref={register()}
        />
      )}
    </>
  );
};

export default UsernameValidationForm;
