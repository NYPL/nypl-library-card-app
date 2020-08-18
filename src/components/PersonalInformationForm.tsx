import React from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";
import { Checkbox } from "@nypl/design-system-react-components";
import FormField from "./FormField";
import { Address } from "../interfaces";
import AgeForm from "./AgeForm";
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

function PersonalInformationForm({ agencyType = "" }) {
  const { register, errors } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;

  const checkBoxLabelOptions = {
    id: "receiveEmails",
    labelContent: (
      <>
        Yes, I would like to receive information about NYPL&apos;s programs and
        services
      </>
    ),
  };

  return (
    <>
      <div className="nypl-name-field">
        <FormField
          id="patronFirstName"
          type="text"
          label="First Name"
          fieldName="firstName"
          isRequired
          // Every input field is registered to react-hook-form. If this
          // field is empty on blur or on submission, the error message will
          // display below the input.
          ref={register({
            required: errorMessages.firstName,
          })}
          errorState={errors}
          defaultValue={formValues.firstName}
        />
        <FormField
          id="patronLastName"
          type="text"
          label="Last Name"
          fieldName="lastName"
          isRequired
          errorState={errors}
          ref={register({
            required: errorMessages.lastName,
          })}
          defaultValue={formValues.lastName}
        />
      </div>

      <AgeForm
        policyType={agencyType || formValues.policyType}
        errorMessages={errorMessages}
      />

      <FormField
        id="patronEmail"
        className="nypl-text-field"
        type="text"
        label="E-mail"
        fieldName="email"
        errorState={errors}
        ref={register({
          required: false,
          validate: (val) => val === "" || isEmail(val) || errorMessages.email,
        })}
        defaultValue={formValues.email}
      />
      <Checkbox
        checkboxId="patronECommunications"
        name="ecommunicationsPref"
        labelOptions={checkBoxLabelOptions}
        // Users must opt-out.
        isSelected={true}
        ref={register()}
        attributes={{ defaultChecked: formValues.ecommunicationsPref }}
      />
    </>
  );
}

export default PersonalInformationForm;
