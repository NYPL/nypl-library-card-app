/* eslint-disable */
import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import {
  Button,
  ButtonTypes,
  Link as DSLink,
  LinkTypes,
} from "@nypl/design-system-react-components";

import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
  findLibraryCode,
} from "../../../src/utils/formDataUtils";
import PersonalInformationForm from "../../../src/components/PersonalInformationForm";
import AccountForm from "../../../src/components/AccountForm";
import AddressForm, { AddressTypes } from "../../../src/components/AddressForm";
import { Address } from "../../../src/interfaces";

const errorMessages = {
  address: {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5-digit postal code.",
  } as Address,
};

/**
 * ReviewPage
 * Main page component for the "form submission review" page.
 */
function ReviewPage() {
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();

  const [editPersonalInfoFlag, setEditPersonalInfoFlag] = useState(false);
  const [editAddressInfoFlag, setEditAddressInfoFlag] = useState(false);
  const [editAccountInfoFlag, setEditAccountInfoFlag] = useState(false);

  const editSectionInfo = (formData) => {
    dispatch({
      type: "SET_FORM_DATA",
      value: {
        ...formValues,
        ...formData,
      },
    });
    setEditPersonalInfoFlag(false);
    setEditAccountInfoFlag(false);
    setEditAddressInfoFlag(false);
  };

  const submitForm = (formData) => {
    // This is resetting any errors from previous submissions, if any.
    dispatch({ type: "SET_FORM_ERRORS", value: null });

    // Convert the home library name to its code value.
    formData.homeLibraryCode = findLibraryCode(formData.homeLibraryCode);

    // Update the global state.
    dispatch({
      type: "SET_FORM_DATA",
      value: formData,
    });

    axios
      .post(
        "/api/create-patron",
        formData
        // {
        //    headers: { "csrf-token": csrfToken },
        // }
      )
      .then((response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });
        router.push("/confirmation?newCard=true");
      })
      .catch((error) => {
        // There are server-side errors! So go back to the main page and
        // render the error messages so they can be fixed.
        dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
        router.push("/library-card/new");
      });
  };
  const submitButton = (
    <Button buttonType={ButtonTypes.Primary} onClick={() => {}} type="submit">
      Submit
    </Button>
  );
  const editButton = (editSectionFlag) => (
    <Button
      buttonType={ButtonTypes.Primary}
      onClick={() => editSectionFlag(true)}
    >
      Edit
    </Button>
  );

  return (
    <div className="nypl-row review-page">
      <div className="nypl-column-half nypl-column-offset-one">
        <h2>Verify your Information</h2>
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

        <div className="form-buttons">
          <form onSubmit={handleSubmit(submitForm)}>
            <Link href="/library-card/new" passHref>
              <DSLink type={LinkTypes.Button}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                Edit
              </DSLink>
            </Link>
            {submitButton}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
