/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { isEmail } from "validator";
import { Checkbox, Accordion } from "@nypl/design-system-react-components";
import { useForm, FormProvider } from "react-hook-form";
import Router from "next/router";
import FormField from "./FormField";
import ApiErrors from "./ApiErrors";
import config from "../../appConfig";
import FormFooterText from "./FormFooterText";
import UsernameValidationForm from "./UsernameValidationForm";
import LibraryListForm from "./LibraryListForm";
import ilsLibraryList from "../data/ilsLibraryList";
import AcceptTermsForm from "./AcceptTermsForm";
import AddressForm, { AddressTypes } from "./AddressForm";
import { Address } from "../interfaces";
import useParamsContext from "../context/ParamsContext";
import useFormResultsContext from "../context/FormResultsContext";
import AgeForm from "./AgeForm";

// The interface for the react-hook-form state data object.
interface FormInput {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  "home-line1": string;
  "home-line2": string;
  "home-city": string;
  "home-state": string;
  "home-zip": string;
  "work-line1": string;
  "work-line2": string;
  "work-city": string;
  "work-state": string;
  "work-zip": string;
  username: string;
  pin: string;
  ecommunicationsPref: boolean;
  location?: string;
  homeLibraryCode: string;
  acceptTerms: boolean;
}

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
  const errorSection = React.createRef<HTMLDivElement>();
  const [errorObj, setErrorObj] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const params = useParamsContext();
  const { setFormResults } = useFormResultsContext();
  const formMethods = useForm<FormInput>({ mode: "onBlur" });

  // Specific functions and object from react-hook-form.
  const { register, handleSubmit, errors, watch } = formMethods;

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
  //   csrfToken && setCsrfToken(csrfToken);
  // });
  const getMetaTagContent = (tag) => {
    return document.head.querySelector(`[${tag}]`).textContent;
  };

  const getPatronAgencyType = (agencyTypeParam) => {
    const { agencyType } = config;
    return !isEmpty(agencyTypeParam) && agencyTypeParam.toLowerCase() === "nys"
      ? agencyType.nys
      : agencyType.default;
  };

  /**
   * submitForm
   * Makes an internal API call to create a new patron.
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData: FormInput) => {
    // This is resetting any errors from previous submissions, if any.
    setErrorObj(null);
    // Render the loading component.
    setIsLoading(true);

    const agencyType = getPatronAgencyType(formData.location);
    axios
      .post(
        "/api/create-patron",
        {
          ...formData,
          agencyType,
        }
        // {
        // headers: { "csrf-token": csrfToken },
        // }
      )
      .then((response) => {
        // Don't render the loading component anymore.
        setIsLoading(false);
        // Set the returned response as the global data.
        setFormResults(response.data);
        Router.push("/confirmation?newCard=true");
      })
      .catch((error) => {
        // There are server-side errors!
        // So render the component to display them.
        setErrorObj(error.response?.data);
        setIsLoading(false);
      });
  };

  const renderLoader = () => {
    return isLoading ? <div className="loading" /> : null;
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
    const checkBoxLabelOptions = {
      id: "receiveEmails",
      labelContent: (
        <>
          Yes, I would like to receive information about NYPL&apos;s programs
          and services
        </>
      ),
    };

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
        <div className="nypl-name-field">
          <FormField
            id="patronFirstName"
            type="text"
            label="First Name"
            fieldName="firstName"
            isRequired
            // Every input field is registered to react-hook-form. If this
            // field is empty on blur or on submission, the error message will
            // display below the input.
            ref={register({
              required: errorMessages.firstName,
            })}
            errorState={errors}
          />
          <FormField
            id="patronLastName"
            type="text"
            label="Last Name"
            fieldName="lastName"
            isRequired
            errorState={errors}
            ref={register({
              required: errorMessages.lastName,
            })}
          />
        </div>

        <AgeForm policyType={params.policyType} errorMessages={errorMessages} />

        <FormField
          id="patronEmail"
          className="nypl-text-field"
          type="text"
          label="E-mail"
          fieldName="email"
          errorState={errors}
          ref={register({
            required: false,
            validate: (val) =>
              val === "" || isEmail(val) || errorMessages.email,
          })}
        />
        <Checkbox
          checkboxId="patronECommunications"
          name="ecommunicationsPref"
          labelOptions={checkBoxLabelOptions}
          // Users must opt-out.
          isSelected={true}
          ref={register()}
        />

        <h3>Address</h3>

        <div className="nypl-radiobutton-field">
          <fieldset>
            <legend id="radiobutton-location">
              I live, work, go to school, or pay property taxes at an address
              in: <span className="nypl-required-field"> Required</span>
            </legend>
            <label id="radiobutton-location_nyc" htmlFor="location-nyc">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_nyc"
                id="location-nyc"
                type="radio"
                name="location"
                value="nyc"
                ref={register()}
              />
              New York City (All five boroughs)
            </label>
            <label id="radiobutton-location_nys" htmlFor="location-nys">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_nys"
                id="location-nys"
                type="radio"
                name="location"
                value="nys"
                ref={register()}
              />
              New York State (Outside NYC)
            </label>
            <label id="radiobutton-location_us" htmlFor="location-us">
              <input
                aria-labelledby="radiobutton-location radiobutton-location_us"
                id="location-us"
                type="radio"
                name="location"
                value="us"
                // For radio buttons or for grouped inputs, the validation
                // config goes in the last element.
                ref={register({
                  required: errorMessages.location,
                })}
              />
              United States (Visiting NYC)
            </label>
          </fieldset>
        </div>

        <p className="nypl-address-note">
          If your address is outside the United States, please use our{" "}
          <a href="https://catalog.nypl.org/selfreg/patonsite">
            alternate form
          </a>
          .
        </p>

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

        <LibraryListForm
          libraryList={ilsLibraryList}
          // The default branch is the "SimplyE" branch with a code of "eb".
          defaultValue="eb"
        />

        <h3>Create Your Account</h3>

        <UsernameValidationForm errorMessage={errorMessages.username} />

        <FormField
          id="patronPin"
          className="nypl-text-field"
          type="text"
          label="PIN"
          fieldName="pin"
          instructionText="4 digits"
          isRequired
          errorState={errors}
          maxLength={4}
          ref={register({
            validate: (val) => val.length === 4 || errorMessages.pin,
          })}
        />

        <AcceptTermsForm />

        <input
          type="hidden"
          aria-hidden={true}
          name="policyType"
          defaultValue={params.policyType || undefined}
          ref={register()}
        />

        <div>
          <input
            className="nypl-request-button"
            disabled={!acceptedTerms || isLoading}
            type="submit"
            value="Continue"
          />
          {renderLoader()}
        </div>
      </form>
    );
  };

  return (
    <div className="nypl-row">
      <div className="nypl-column-half nypl-column-offset-one">
        <div>
          <FormProvider {...formMethods}>
            {renderApiErrors(errorObj)}
            {renderFormFields()}
          </FormProvider>
        </div>
        <FormFooterText />
      </div>
    </div>
  );
};

export default LibraryCardForm;
