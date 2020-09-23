/* eslint-disable */
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useParamsContext from "../../context/ParamsContext";
import useFormDataContext from "../../context/FormDataContext";
import LocationForm from "../LocationForm";
import { errorMessages, getPatronAgencyType } from "../../utils/formDataUtils";
import RoutingLinks from "../RoutingLinks.tsx";

const LocationFormContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { errorObj, formValues } = state;
  const params = useParamsContext();
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { register, handleSubmit } = useFormContext();

  // TODO: This works but need to implement CSRF in the backend.
  // useEffect(() => {
  //   const csrfToken = getMetaTagContent("name=csrf-token");
  //   if (csrfToken) {
  //     dispatch({ type: "SET_CSRF_TOKEN", value: csrfToken });
  //   }
  // });
  // const getMetaTagContent = (tag) => {
  //   return document.head.querySelector(`[${tag}]`).textContent;
  // };

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    console.log("Location");
    console.log("formData", formData);
    console.log("formValues", formValues);

    formData.agencyType = getPatronAgencyType(formData.location);
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    router.push("/library-card/personal?newCard=true");
  };

  return (
    <form
      className="nypl-library-card-form"
      onSubmit={handleSubmit(submitForm)}
    >
      <LocationForm errorMessage={errorMessages.location} />

      <input
        type="hidden"
        aria-hidden={true}
        name="policyType"
        defaultValue={params.policyType || formValues.policyType}
        ref={register()}
      />

      <RoutingLinks
        previous={{ url: "/library-card/new" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default LocationFormContainer;
