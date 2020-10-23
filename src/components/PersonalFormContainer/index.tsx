import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import PersonalForm from "../PersonalForm";
import RoutingLinks from "../RoutingLinks.tsx";
import { lcaEvents } from "../../externals/gaUtils";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues, query } = state;
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
    <form onSubmit={handleSubmit(submitForm)}>
      <PersonalForm agencyType={query.policyType} />

      <input
        type="hidden"
        aria-hidden={true}
        name="policyType"
        // Both `query` and `formValues` are coming from the app's state. The
        // default for the `policyType` is "webApplicant" but the app can
        // override that by passing in the `policyType` through a query param
        // in the URL. All query params are also stored in the app's state.
        defaultValue={query.policyType || formValues.policyType}
        ref={register()}
      />

      <RoutingLinks
        previous={{ url: "/new?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default PersonalFormContainer;
