import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import PersonalForm from "../PersonalForm";
import RoutingLinks from "../RoutingLinks.tsx";

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

    router.push("/library-card/location?newCard=true");
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <PersonalForm agencyType={query.policyType} />

      <input
        type="hidden"
        aria-hidden={true}
        name="policyType"
        defaultValue={query.policyType || formValues.policyType}
        ref={register()}
      />

      <RoutingLinks
        previous={{ url: "/library-card/new?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default PersonalFormContainer;
