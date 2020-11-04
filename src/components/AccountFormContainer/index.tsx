import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import RoutingLinks from "../RoutingLinks.tsx";
import AccountFormFields from "../AccountFormFields";
import AcceptTermsFormFields from "../AcceptTermsFormFields";
import { findLibraryCode } from "../../utils/formDataUtils";
import { lcaEvents } from "../../externals/gaUtils";

const AccountFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();

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

    const nextUrl = "/review?newCard=true";
    lcaEvents("Navigation", `Next button to ${nextUrl}`);
    router.push(nextUrl);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <AccountFormFields />

      <AcceptTermsFormFields />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <input type="hidden" aria-hidden={true} name="page" value="account" />
      <input
        type="hidden"
        aria-hidden={true}
        name="formValues"
        value={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/address-verification?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AccountFormContainer;
