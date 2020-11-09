import React from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";
import { Checkbox } from "@nypl/design-system-react-components";

import FormField from "../FormField";
import AgeFormFields from "../AgeFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";
import styles from "./PersonalFormFields.module.css";

function PersonalForm({ agencyType = "" }) {
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
  const instructionText = (
    <>
      If you do not wish to provide an email address, please use our{" "}
      <a href="#something">alternate form</a>.
    </>
  );
  return (
    <>
      <div className={`input-group ${styles.inputGroup}`}>
        <div style={{ flex: "1" }}>
          <FormField
            id="firstName"
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
        </div>
        <div style={{ flex: "1" }}>
          <FormField
            id="lastName"
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
      </div>

      <AgeFormFields
        policyType={agencyType || formValues.policyType}
        errorMessages={errorMessages}
      />

      <FormField
        id="email"
        label="E-Mail Address"
        fieldName="email"
        errorState={errors}
        isRequired
        ref={register({
          required: errorMessages.email,
          validate: (val) => val === "" || isEmail(val) || errorMessages.email,
        })}
        defaultValue={formValues.email}
        instructionText={instructionText as any}
      />

      <Checkbox
        checkboxId="eCommunications"
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

export default PersonalForm;
