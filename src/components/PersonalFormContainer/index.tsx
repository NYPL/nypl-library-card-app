/* eslint-disable */
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useParamsContext from "../../context/ParamsContext";
import useFormDataContext from "../../context/FormDataContext";
import PersonalInformationForm from "../PersonalInformationForm";
import RoutingLinks from "../RoutingLinks.tsx";

const PersonalFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const params = useParamsContext();
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();

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

    router.push("/library-card/address?newCard=true");
  };

  return (
    <form
      className="nypl-library-card-form"
      onSubmit={handleSubmit(submitForm)}
    >
      <PersonalInformationForm agencyType={params.policyType} />

      <RoutingLinks
        previous={{ url: "/library-card/location?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default PersonalFormContainer;
