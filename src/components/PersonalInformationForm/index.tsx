import React from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";
import { Checkbox } from "@nypl/design-system-react-components";

import FormField from "../FormField";
import AgeForm from "../AgeForm";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";

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
