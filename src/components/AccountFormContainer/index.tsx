import {
  Form,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import RoutingLinks from "../RoutingLinks.tsx";
import AccountFormFields from "../AccountFormFields";
import AcceptTermsFormFields from "../AcceptTermsFormFields";
import { findLibraryCode } from "../../utils/formDataUtils";
import { lcaEvents } from "../../externals/gaUtils";
import FormField from "../FormField";
import { createQueryParams } from "../../utils/utils";

const AccountFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();
  // Get the URL query params for `newCard` and `lang`.
  const queryStr = createQueryParams(router?.query);

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    // Convert the home library name to its code value.
    formData.homeLibraryCode = findLibraryCode(formData.homeLibraryCode);
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    const nextUrl = `/review?${queryStr}`;
    lcaEvents("Navigation", `Next button to ${nextUrl}`);
    router.push(nextUrl);
  };

  return (
    <Form
      action="/library-card/api/submit"
      id="account-form-container"
      method="post"
      onSubmit={handleSubmit(submitForm)}
    >
      <AccountFormFields id="account-form-container" />
      <AcceptTermsFormFields />

      <FormRow display="none">
        <DSFormField>
          {/* Not register to react-hook-form because we only want to
              use this value for the no-js scenario. */}
          <FormField
            id="hidden-account-page"
            type="hidden"
            name="page"
            defaultValue="account"
          />
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
            previous={{ url: `/address-verification?${queryStr}` }}
            next={{ submit: true }}
          />
        </DSFormField>
      </FormRow>
    </Form>
  );
};

export default AccountFormContainer;
