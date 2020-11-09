import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import PersonalFormFields from "../PersonalFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import { lcaEvents } from "../../externals/gaUtils";

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
    <form
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <PersonalFormFields agencyType={formValues.policyType} />

      <input
        type="hidden"
        aria-hidden={true}
        name="policyType"
        defaultValue={formValues.policyType}
        ref={register()}
      />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <input type="hidden" aria-hidden={true} name="page" value="personal" />
      <input
        type="hidden"
        aria-hidden={true}
        name="formValues"
        value={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/new?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default PersonalFormContainer;
