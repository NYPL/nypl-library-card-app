/* eslint-disable */
import React, { useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import { Accordion } from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";

import ApiErrors from "./ApiErrors";
import FormFooterText from "./FormFooterText";
import AddressForm, { AddressTypes } from "./AddressForm";
import { Address } from "../interfaces";
import useParamsContext from "../context/ParamsContext";
import useFormDataContext from "../context/FormDataContext";
import LocationForm from "./LocationForm";
import { findLibraryCode, getPatronAgencyType } from "../utils/formDataUtils";
import PersonalInformationForm from "./PersonalInformationForm";
import AccountForm from "./AccountForm";
import AcceptTermsForm from "./AcceptTermsForm";

const errorMessages = {
  firstName: "Please enter a valid first name.",
  lastName: "Please enter a valid last name.",
  birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
  ageGate: "You must be 13 years or older to continue.",
  email: "Please enter a valid email address.",
  username: "Username must be between 5-25 alphanumeric characters.",
  pin: "Please enter a 4-digit PIN.",
  location: "Please select an address option.",
  address: {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5-digit postal code.",
  } as Address,
};

const LibraryCardForm = () => {
  const { state, dispatch } = useFormDataContext();
  const { errorObj, formValues } = state;
  const params = useParamsContext();
  const errorSection = React.createRef<HTMLDivElement>();
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { register, handleSubmit, watch } = useFormContext();

  // Will run whenever the `errorObj` has changes, specifically for
  // bad requests.
  useEffect(() => {
    if (errorObj) {
      errorSection.current.focus();
      document.title = "Form Submission Error | NYPL";
    }
  }, [errorObj]);

  // TODO: This works but need to implement CSRF in the backend.
  // useEffect(() => {
  //   const csrfToken = getMetaTagContent("name=csrf-token");
  //   if (csrfToken) {
  //     dispatch({ type: "SET_CSRF_TOKEN", value: csrfToken });
  //   }
  // });
  const getMetaTagContent = (tag) => {
    return document.head.querySelector(`[${tag}]`).textContent;
  };

  /**
   * submitForm
   * Makes an internal API call to create a new patron.
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    formData.homeLibraryCode = findLibraryCode(formData.homeLibraryCode);
    formData.agencyType = getPatronAgencyType(formData.location);

    // Set the global state...
    dispatch({ type: "SET_FORM_DATA", value: formData });
    // And now go to the next page.
    router.push("/library-card/address");
  };

  /**
   * renderApiErrors
   * This renders the component above the form that displays information on
   * the error(s) from the submission. Also renders links that link to the
   * specific input element that is returning an error.
   * @param errorObj
   */
  const renderApiErrors = (errorObj) => {
    if (!isEmpty(errorObj) && errorObj.status >= 400) {
      return <ApiErrors ref={errorSection} apiResults={errorObj} />;
    }
    return null;
  };

  /**
   * renderFormFields
   * This renders the complete form. Refactoring this later.
   */
  const renderFormFields = () => {
    // Watch the `acceptTerms` named field. If it's checked/true, the submit
    // button will be enabled.
    const acceptedTerms = watch("acceptTerms");

    return (
      <form
        className="nypl-library-card-form"
        onSubmit={handleSubmit(submitForm)}
      >
        <h2>Please enter the following information</h2>
        <h3>Personal Information</h3>

        <PersonalInformationForm agencyType={params.policyType} />

        <h3>Address</h3>

        <LocationForm errorMessage={errorMessages.location} />

        <AddressForm
          type={AddressTypes.Home}
          errorMessages={errorMessages.address}
        />

        <h3>Work Address</h3>
        <Accordion
          id="work-address-accordion"
          accordionLabel="Optional Fields"
          className="work-address-accordion"
        >
          <AddressForm
            type={AddressTypes.Work}
            errorMessages={errorMessages.address}
          />
        </Accordion>

        <h3>Create Your Account</h3>

        <AccountForm />

        <AcceptTermsForm />

        <input
          type="hidden"
          aria-hidden={true}
          name="policyType"
          defaultValue={params.policyType || formValues.policyType}
          ref={register()}
        />

        <input
          className="nypl-request-button"
          disabled={!acceptedTerms}
          type="submit"
          value="Continue"
        />
      </form>
    );
  };

  return (
    <div className="nypl-row">
      <div className="nypl-column-half nypl-column-offset-one">
        {renderApiErrors(errorObj)}
        {renderFormFields()}
        <FormFooterText />
      </div>
    </div>
  );
};

export default LibraryCardForm;
