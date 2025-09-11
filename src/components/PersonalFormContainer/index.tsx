import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import PersonalFormFields from "../PersonalFormFields";
import RoutingLinks from "../RoutingLinks.tsx";

import FormField from "../FormField";
import {
  Form,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import { createQueryParams } from "../../utils/utils";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { register, handleSubmit } = useFormContext();
  // Get the URL query params for `newCard` and `lang`.
  const queryStr = createQueryParams(router?.query);
  // Pass the selected language as the "preferred language"
  // to the submitted form values. This then gets sent to
  // the ILS when creating a patron.
  const preferredLanguage = router?.query?.lang || "en";

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData, e) => {
    e.preventDefault();
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData, preferredLanguage },
    });

    const nextUrl = `/location?${queryStr}`;
    router.push(nextUrl);
  };

  return (
    <Form
      id="perform-form-container"
      onSubmit={handleSubmit(submitForm)}
      method="post"
      // action="/library-card/api/submit"
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
            previous={{ url: `/new?${queryStr}` }}
            next={{ submit: true }}
          />
        </DSFormField>
      </FormRow>
    </Form>
  );
};

export default PersonalFormContainer;
