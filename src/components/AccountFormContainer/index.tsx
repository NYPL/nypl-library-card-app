import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import useFormDataContext from "../../context/FormDataContext";
import RoutingLinks from "../RoutingLinks.tsx";
import AccountForm from "../AccountForm";
import AcceptTermsForm from "../AcceptTermsForm";
import { findLibraryCode } from "../../utils/formDataUtils";

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

    router.push("/library-card/review?newCard=true");
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <AccountForm />

      <AcceptTermsForm />

      <RoutingLinks
        previous={{ url: "/library-card/address-verification?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AccountFormContainer;
