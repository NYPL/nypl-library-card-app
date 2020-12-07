import React from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";
import { Checkbox } from "@nypl/design-system-react-components";

import FormField from "../FormField";
import AgeFormFields from "../AgeFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";

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
      An email address is required to use many of our digital resources, such as
      e-books. If you do not wish to provide an email address, you can apply for
      a physical card using our{" "}
      <a href="https://catalog.nypl.org/selfreg/patonsite">alternate form</a>.
      Once filled out, please visit one of our{" "}
      <a href="https://www.nypl.org/locations">locations</a> with proof of
      identity and home address to pick up your card.
    </>
  );
  return (
    <>
      <div className={`input-group`}>
        <div style={{ flex: "1" }}>
          <FormField
            id="firstName"
            label="First Name"
            name="firstName"
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
            name="lastName"
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
        label="Email Address"
        name="email"
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
