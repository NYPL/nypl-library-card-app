/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { isAlphanumeric } from "validator";
import { Button } from "@nypl/design-system-react-components";
import FormField from "./FormField/FormField";

interface UsernameValidationFormProps {
  watch: (value) => boolean;
  getValues: (value) => string;
  register: any;
  errorMessage?: string;
  errors?: {};
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
  watch,
  getValues,
  register,
  errorMessage = "",
  errors = {},
}: UsernameValidationFormProps) => {
  const defaultState = {
    available: false,
    message: "",
  };
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(defaultState);
  const usernameWatch = watch("username");

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
      .post(
        "/api/username",
        { username }
        // {
        // headers: { "csrf-token": csrfToken },
        // }
      )
      .then((response) => {
        setUsernameIsAvailable({
          available: true,
          message: response.data?.message,
        });
      })
      .catch((error) => {
        setUsernameIsAvailable({
          available: false,
          message: error.response?.data?.message,
        });
      });
  };
  const inputValidation = (value = "") =>
    value.length >= 5 && value.length <= 25 && isAlphanumeric(value);
  let availableClassname = usernameIsAvailable.available
    ? "available"
    : "unavailable";

  /**
   * renderButton
   * Render the button to validate a username only if there's an input and
   * if there's no success or error message.
   */
  const renderButton = () => {
    const username = getValues("username");
    const canValidate = inputValidation(username);
    return (
      canValidate &&
      !usernameIsAvailable.message && (
        <Button onClick={validateUsername} type="button">
          Check if username is available
        </Button>
      )
    );
  };

  return (
    <>
      <FormField
        id="patronUsername"
        className="nypl-text-field"
        type="text"
        label="Username"
        fieldName="username"
        instructionText="5-25 alphanumeric characters"
        isRequired
        errorState={errors}
        maxLength={25}
        childRef={register({
          validate: (val) => inputValidation(val) || errorMessage,
        })}
      />
      {renderButton()}
      {usernameIsAvailable.message && (
        <>
          <div className={`username-helper-text ${availableClassname}`}>
            {usernameIsAvailable.message}
          </div>
          <input
            type="hidden"
            aria-hidden={true}
            name="usernameHasBeenValidated"
            defaultValue={`${usernameIsAvailable.available}`}
            ref={register()}
          />
        </>
      )}
    </>
  );
};

export default UsernameValidationForm;