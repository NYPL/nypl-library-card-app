import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import PersonalFormFields from "../PersonalFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import { lcaEvents } from "../../externals/gaUtils";
import FormField from "../FormField";
import {
  Form,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { register, handleSubmit } = useFormContext();

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    const nextUrl = "/location?newCard=true";
    lcaEvents("Navigation", `Next button to ${nextUrl}`);
    router.push(nextUrl);
  };

  return (
    <Form
      id="perform-form-container"
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <PersonalFormFields
        agencyType={formValues.policyType}
        id="perform-form-container"
      />

      <FormRow display="none">
        <DSFormField>
          <FormField
            id="hidden-policyType"
            defaultValue={formValues.policyType}
            name="policyType"
            ref={register()}
            type="hidden"
          />
        </DSFormField>
        <DSFormField>
          {/* Not register to react-hook-form because we only want to
              use this value for the no-js scenario. */}
          <FormField
            id="hidden-personal-page"
            type="hidden"
            name="page"
            defaultValue="personal"
          />
        </DSFormField>
        <DSFormField>
          <FormField
            id="hidden-form-values"
            type="hidden"
            name="formValues"
            defaultValue={JSON.stringify(formValues)}
          />
        </DSFormField>
      </FormRow>

      <FormRow>
        <DSFormField>
          <RoutingLinks
            previous={{ url: "/new?newCard=true" }}
            next={{ submit: true }}
          />
        </DSFormField>
      </FormRow>
    </Form>
  );
};

export default PersonalFormContainer;
