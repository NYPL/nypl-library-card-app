/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import { Button, ButtonTypes } from "@nypl/design-system-react-components";
import isEmpty from "lodash/isEmpty";
import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
} from "../../../src/utils/formDataUtils";
import PersonalInformationForm from "../PersonalInformationForm";
import AccountForm from "../AccountForm";
import AddressForm, { AddressTypes } from "../AddressForm";
import { errorMessages } from "../../../src/utils/formDataUtils";
import RoutingLinks from "../RoutingLinks.tsx";
import ApiErrors from "../ApiErrors";

/**
 * ReviewFormContainer
 * Main page component for the "form submission review" page.
 */
function ReviewFormContainer() {
  const { handleSubmit } = useFormContext();
  const errorSection = React.createRef<HTMLDivElement>();
  const { state, dispatch } = useFormDataContext();
  const { formValues, errorObj } = state;
  const router = useRouter();

  // Flags to set a section to editable or read-only.
  const [editPersonalInfoFlag, setEditPersonalInfoFlag] = useState(false);
  const [editAddressInfoFlag, setEditAddressInfoFlag] = useState(false);
  const [editAccountInfoFlag, setEditAccountInfoFlag] = useState(false);

  // Will run whenever the `errorObj` has changes, specifically for
  // bad requests.
  useEffect(() => {
    if (errorObj) {
      errorSection.current.focus();
      document.title = "Form Submission Error | NYPL";
    }
  }, [errorObj]);

  // Shareable button for each editable section.
  const editButton = (editSectionFlag) => (
    <Button
      buttonType={ButtonTypes.Primary}
      onClick={() => editSectionFlag(true)}
    >
      Edit
    </Button>
  );
  const submitButton = (
    <Button buttonType={ButtonTypes.Primary} onClick={() => {}} type="submit">
      Submit
    </Button>
  );

  /**
   * editSectionInfo
   * Each section has its own form and needs its own edit button, but the data
   * is not being manipulated, just updated, so they can all use the same
   * function to set the global data.
   */
  const editSectionInfo = (formData) => {
    dispatch({
      type: "SET_FORM_DATA",
      value: {
        ...formValues,
        ...formData,
      },
    });
    // Set all to false even though not all are on.
    setEditPersonalInfoFlag(false);
    setEditAccountInfoFlag(false);
    setEditAddressInfoFlag(false);
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
   * submitForm
   * Update the form values again but this time submit to the API.
   */
  const submitForm = (formData) => {
    // This is resetting any errors from previous submissions, if any.
    dispatch({ type: "SET_FORM_ERRORS", value: null });

    const submitValues = { ...formData, ...formValues };

    // Convert the home library name to its code value.
    // submitValues.homeLibraryCode = findLibraryCode(formValues.homeLibraryCode);

    // Update the global state.
    dispatch({
      type: "SET_FORM_DATA",
      value: submitValues,
    });

    axios
      .post("/api/create-patron", submitValues)
      .then((response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });
        router.push("/library-card/congrats?newCard=true");
      })
      .catch((error) => {
        // There are server-side errors! So go back to the main page and
        // render the error messages so they can be fixed.
        dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
        router.push("/library-card/new");
      });
  };

  return (
    <>
      <h3>
        You have entered the information listed below. Please review before
        submitting.
      </h3>

      <div className="form-review-section">
        <h4>Personal Information</h4>
        {!editPersonalInfoFlag ? (
          <>
            <dl>
              <dt>Name</dt>
              <dd>
                {formValues.firstName} {formValues.lastName}
              </dd>
              <dt>BirthDate</dt>
              <dd>{formValues.birthdate}</dd>
              <dt>Email</dt>
              <dd>{formValues.email}</dd>
              <dt>
                Receive information about NYPL&apos;s programs and services
              </dt>
              <dd>{formValues.ecommunicationsPref ? "Yes" : "No"}</dd>
            </dl>
            {editButton(setEditPersonalInfoFlag)}
          </>
        ) : (
          <form onSubmit={handleSubmit(editSectionInfo)}>
            <PersonalInformationForm />
            {submitButton}
          </form>
        )}
      </div>

      <div className="form-review-section">
        <h4>Address</h4>
        {!editAddressInfoFlag ? (
          <>
            <dl>
              <dt>Location</dt>
              <dd>{getLocationValue(formValues.location)}</dd>
              <dt>Home Address</dt>
              <dd>
                {formValues["home-line1"]}
                {formValues["home-line2"]}
                <br />
                {formValues["home-city"]}, {formValues["home-state"]}{" "}
                {formValues["home-zip"]}
              </dd>
              {formValues["work-line1"] && (
                <>
                  <dt>Work Address</dt>
                  <dd>
                    {formValues["work-line1"]}
                    {formValues["work-line2"]}
                    <br />
                    {formValues["work-city"]}, {formValues["work-state"]}{" "}
                    {formValues["work-zip"]}
                  </dd>
                </>
              )}
            </dl>
            {editButton(setEditAddressInfoFlag)}
          </>
        ) : (
          <form onSubmit={handleSubmit(editSectionInfo)}>
            <AddressForm
              type={AddressTypes.Home}
              errorMessages={errorMessages.address}
            />
            {formValues["work-line1"] && (
              <>
                <h4>Work Address</h4>
                <AddressForm
                  type={AddressTypes.Work}
                  errorMessages={errorMessages.address}
                />
              </>
            )}
            {submitButton}
          </form>
        )}
      </div>

      <div className="form-review-section">
        <h4>Account</h4>
        {!editAccountInfoFlag ? (
          <>
            <dl>
              <dt>Username</dt>
              <dd>{formValues.username}</dd>
              <dt>Pin</dt>
              <dd>{formValues.pin}</dd>
              <dt>Home Library</dt>
              <dd>{findLibraryName(formValues.homeLibraryCode)}</dd>
            </dl>
            {editButton(setEditAccountInfoFlag)}
          </>
        ) : (
          <form onSubmit={handleSubmit(editSectionInfo)}>
            <AccountForm />
            {submitButton}
          </form>
        )}
      </div>

      <form onSubmit={handleSubmit(submitForm)}>
        <RoutingLinks next={{ submit: true, text: "Submit" }} />
      </form>
    </>
  );
}

export default ReviewFormContainer;
