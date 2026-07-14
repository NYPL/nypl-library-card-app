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
import { pollReport } from "../../utils/pollReports";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { handleSubmit } = useFormContext();
  const queryStr = createQueryParams(router?.query);
  const preferredLanguage = router?.query?.lang || "en";

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = async (formData, e) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData, preferredLanguage },
    });

    const age = getAge(formData.birthdate);
    if (age >= 13 && age <= 17) {
      try {
        const { data } = await axios.post(
          "/library-card/api/identity-verification/email-check",
          { email: formData.email }
        );
        const result =
          data.status === "pending"
            ? await pollReport(
                "/api/identity-verification/email-check",
                data.report_id
              )
            : data;

        dispatch({
          type: "SET_EMAIL_CHECK_STATUS",
          value: result ?? data,
        });
      } catch (err) {
        console.error("Email check failed", err);
      }
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
