import React from "react";
import { useFormContext } from "react-hook-form";
import FormField from "./FormField";
import { Address } from "../interfaces";
import UsernameValidationForm from "./UsernameValidationForm";
import LibraryListForm from "./LibraryListForm";
import ilsLibraryList from "../data/ilsLibraryList";
import useFormDataContext from "../context/FormDataContext";

const errorMessages = {
  firstName: "Please enter a valid first name.",
  lastName: "Please enter a valid last name.",
  birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
  ageGate: "You must be 13 years or older to continue.",
  email: "Please enter a valid email address.",
  username: "Username must be between 5-25 alphanumeric characters.",
  pin: "Please enter a 4-digit PIN.",
  location: "Please select an address option.",
  address: {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5-digit postal code.",
  } as Address,
};

function AccountInformationForm() {
  const { register, errors } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;

  return (
    <>
      <UsernameValidationForm errorMessage={errorMessages.username} />

      <FormField
        id="patronPin"
        className="nypl-text-field"
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

      <LibraryListForm libraryList={ilsLibraryList} />
    </>
  );
}

export default AccountInformationForm;
