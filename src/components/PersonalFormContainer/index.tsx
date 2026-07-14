import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

import useFormDataContext from "../../context/FormDataContext";
import PersonalFormFields from "../PersonalFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import {
  Form,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import { createQueryParams } from "../../utils/utils";
import { getAge } from "../../utils/formDataUtils";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();
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
  const submitForm = async (formData, e) => {
    e.preventDefault();
    setIsLoading(true);
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData, preferredLanguage },
    });

    const age = getAge(formData.birthdate);
    if (age >= 13 && age <= 17) {
      // NOTE: We will need to display this result on the page
      const emailCheckResponse = axios
        .post("/library-card/api/identity-verification/email-check", {
          email: formData.email,
        })
        .catch(() => {
          // NOTE: Render whatever error message we get from the API call on the page
        });

      console.log(emailCheckResponse);
    }

    setIsLoading(false);
    await router.push(`/location?${queryStr}`);
  };

  return (
    <Form
      id="perform-form-container"
      onSubmit={handleSubmit(submitForm)}
      noValidate
    >
      <PersonalFormFields
        agencyType={formValues.policyType}
        id="perform-form-container"
      />

      <FormRow>
        <DSFormField>
          <RoutingLinks
            isDisabled={isLoading}
            previous={{ url: `/new?${queryStr}` }}
            next={{ submit: true }}
          />
        </DSFormField>
      </FormRow>
    </Form>
  );
};

export default PersonalFormContainer;
