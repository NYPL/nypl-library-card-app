import React from "react";
import { useFormContext } from "react-hook-form";
import { isEmail } from "validator";
import {
  Checkbox,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";

import FormField from "../FormField";
import AgeFormFields from "../AgeFormFields";
import useFormDataContext from "../../context/FormDataContext";
import { errorMessages } from "../../utils/formDataUtils";

function PersonalFormFields({ agencyType = "", id = "" }) {
  const { register, errors } = useFormContext();
  const { state } = useFormDataContext();
  const { formValues } = state;
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
      <FormRow id={`${id}-personalForm-1`}>
        <DSFormField>
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
        </DSFormField>
        <DSFormField>
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
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-2`}>
        <DSFormField>
          <AgeFormFields
            policyType={agencyType || formValues.policyType}
            errorMessages={errorMessages}
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-3`}>
        <DSFormField>
          <FormField
            id="email"
            label="Email Address"
            name="email"
            errorState={errors}
            isRequired
            ref={register({
              required: errorMessages.email,
              validate: (val) =>
                val === "" || isEmail(val) || errorMessages.email,
            })}
            defaultValue={formValues.email}
            instructionText={instructionText as any}
          />
        </DSFormField>
      </FormRow>
      <FormRow id={`${id}-personalForm-4`}>
        <DSFormField>
          <Checkbox
            id="eCommunications"
            isChecked={formValues.ecommunicationsPref}
            labelText="Yes, I would like to receive information about NYPL's programs and services"
            name="ecommunicationsPref"
            ref={register()}
          />
        </DSFormField>
      </FormRow>
    </>
  );
}

export default PersonalFormFields;
