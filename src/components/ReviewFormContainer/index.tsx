/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import {
  Button,
  ButtonTypes,
  Input,
  Label,
  InputTypes,
  Checkbox,
} from "@nypl/design-system-react-components";
import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
  findLibraryCode,
} from "../../../src/utils/formDataUtils";
import PersonalForm from "../PersonalForm";
import AccountForm from "../AccountForm";
import RoutingLinks from "../RoutingLinks.tsx";
import ApiErrors from "../ApiErrors";
import styles from "./ReviewFormContainer.module.css";
import AcceptTermsForm from "../AcceptTermsForm";
import Loader from "../Loader";
import { lcaEvents } from "../../externals/gaUtils";

/**
 * ReviewFormContainer
 * Main page component for the "form submission review" page.
 */
function ReviewFormContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = useFormContext();
  const errorSection = React.createRef<HTMLDivElement>();
  const { state, dispatch } = useFormDataContext();
  const { formValues, errorObj } = state;
  const router = useRouter();

  // Flags to set a section to editable or read-only.
  const [editPersonalInfoFlag, setEditPersonalInfoFlag] = useState(false);
  const [editAccountInfoFlag, setEditAccountInfoFlag] = useState(false);

  const [showPin, setShowPin] = useState(false);

  const checkBoxLabelOptions = {
    id: "showPinId",
    labelContent: <>Show PIN</>,
  };
  const updateShowPin = () => setShowPin(!showPin);

  // Will run whenever the `errorObj` has changes, specifically for
  // bad requests.
  useEffect(() => {
    if (errorObj) {
      errorSection.current.focus();
      document.title = "Form Submission Error | NYPL";
      // When we display errors, we want to go into the "Edit" state so
      // that it's easier to go to input fields from the error messages.
      setEditAccountInfoFlag(true);
      setEditPersonalInfoFlag(true);
    }
  }, [errorObj]);

  // Shareable button for each editable section.
  const editSectionButton = (editSectionFlag, sectionName) => (
    <Button
      buttonType={ButtonTypes.Primary}
      onClick={() => {
        lcaEvents("Edit", sectionName);
        editSectionFlag(true);
      }}
    >
      Edit
    </Button>
  );
  const editAddressButton = () => (
    <Button
      buttonType={ButtonTypes.Primary}
      onClick={() => {
        lcaEvents("Edit", "Location/Address");
        router.push("/location?newCard=true");
      }}
    >
      Edit
    </Button>
  );
  const submitSectionButton = (
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
    if (formData.homeLibraryCode) {
      formData.homeLibraryCode = findLibraryCode(formData.homeLibraryCode);
    }
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
  };

  /**
   * submitForm
   * Update the form values again but this time submit to the API.
   */
  const submitForm = () => {
    setIsLoading(true);
    // This is resetting any errors from previous submissions, if any.
    dispatch({ type: "SET_FORM_ERRORS", value: null });

    // Update the global state.
    dispatch({
      type: "SET_FORM_DATA",
      value: formValues,
    });

    axios
      .post("/api/create-patron", formValues)
      .then((response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });
        lcaEvents("Submit", "Submit");
        router.push("/congrats?newCard=true");
      })
      .catch((error) => {
        // There are server-side errors! Display them to the user
        // so they can be fixed.
        dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
      })
      .finally(() => setIsLoading(false));
  };

  /**
   * Render a read-only display of all the submitted values from the personal
   * information form section.
   */
  const renderPersonalInformationValues = () => (
    <div className={styles.container}>
      <div className={styles.multiField}>
        <div className={styles.title}>First Name</div>
        <div>{formValues.firstName}</div>
      </div>
      <div className={styles.multiField}>
        <div className={styles.title}>Last Name</div>
        <div>{formValues.lastName}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>Date Of Birth</div>
        <div>{formValues.birthdate}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>E-Mail Address</div>
        <div>{formValues.email}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>
          Receive information about NYPL&apos;s programs and services
        </div>
        <div>{formValues.ecommunicationsPref ? "Yes" : "No"}</div>
      </div>
      {editSectionButton(setEditPersonalInfoFlag, "Personal Information")}
    </div>
  );
  /**
   * Render a read-only display of all the submitted values from the account
   * form section.
   */
  const renderAccountValues = () => (
    <div className={styles.container}>
      <div className={styles.field}>
        <div className={styles.title}>Username</div>
        <div>{formValues.username}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>PIN</div>
        <div>{showPin ? formValues.pin : "****"}</div>
        <Checkbox
          checkboxId="showPINReview"
          name="showPINReview"
          labelOptions={checkBoxLabelOptions}
          isSelected={false}
          attributes={{
            defaultChecked: showPin,
            onClick: updateShowPin,
          }}
        />
      </div>
      <div className={styles.field}>
        <div className={styles.title}>Home Library</div>
        <div>{findLibraryName(formValues.homeLibraryCode)}</div>
      </div>
      {editSectionButton(setEditAccountInfoFlag, "Create Your Account")}
    </div>
  );
  /**
   * Render a read-only display of all the submitted values from the location
   * and address form section.
   */
  const renderAddressValues = () => (
    <div className={styles.container} id="address-section" tabIndex={0}>
      <div className={styles.field}>
        <div className={styles.title}>Location</div>
        <fieldset>
          {/* For now until we have better tests. This needs a value or an
          empty input and label causes accessibility issues. */}
          {formValues.location && (
            <div className="radio-field">
              <Input
                className="radio-input"
                aria-labelledby="review-location-label"
                id="review-location-id"
                type={InputTypes.radio}
                attributes={{
                  name: "location",
                  "aria-checked": true,
                  checked: true,
                  readOnly: true,
                }}
                value={formValues.location}
              />
              <Label
                id="review-location-label"
                htmlFor="input-review-location-id"
              >
                {getLocationValue(formValues.location)}
              </Label>
            </div>
          )}
        </fieldset>
      </div>
      {formValues["work-line1"] && <h4>Home</h4>}
      <div className={styles.field}>
        <div className={styles.title}>Street Address</div>
        <div>{formValues["home-line1"]}</div>
      </div>
      {formValues["home-line2"] && (
        <div className={styles.field}>
          <div className={styles.title}>Apartment/Suite</div>
          <div>{formValues["home-line2"]}</div>
        </div>
      )}
      <div className={styles.multiField}>
        <div className={styles.title}>City</div>
        <div>{formValues["home-city"]}</div>
      </div>
      <div className={styles.multiField}>
        <div className={styles.title}>State</div>
        <div>{formValues["home-state"]}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>Postal Code</div>
        <div>{formValues["home-zip"]}</div>
      </div>
      {formValues["work-line1"] && (
        <>
          <h4 className={styles.workTitle}>Work</h4>
          <div className={styles.field}>
            <div className={styles.title}>Street Address</div>
            <div>{formValues["work-line1"]}</div>
          </div>
          {formValues["work-line2"] && (
            <div className={styles.field}>
              <div className={styles.title}>Apartment/Suite</div>
              <div>{formValues["work-line2"]}</div>
            </div>
          )}
          <div className={styles.multiField}>
            <div className={styles.title}>City</div>
            <div>{formValues["work-city"]}</div>
          </div>
          <div className={styles.multiField}>
            <div className={styles.title}>State</div>
            <div>{formValues["work-state"]}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.title}>Postal Code</div>
            <div>{formValues["work-zip"]}</div>
          </div>
        </>
      )}

      {editAddressButton()}
    </div>
  );

  return (
    <>
      <Loader isLoading={isLoading} />
      <ApiErrors ref={errorSection} problemDetail={errorObj} />

      <div className={styles.formSection}>
        <h3>Personal Information</h3>
        {!editPersonalInfoFlag ? (
          renderPersonalInformationValues()
        ) : (
          <form onSubmit={handleSubmit(editSectionInfo)}>
            <PersonalForm />
            {submitSectionButton}
          </form>
        )}
      </div>

      <div className={styles.formSection}>
        <h3>Address</h3>
        {renderAddressValues()}
      </div>

      <div className={styles.formSection}>
        <h3>Create Your Account</h3>
        {!editAccountInfoFlag ? (
          renderAccountValues()
        ) : (
          <form onSubmit={handleSubmit(editSectionInfo)}>
            <AccountForm />
            <AcceptTermsForm />
            {submitSectionButton}
          </form>
        )}
      </div>

      <div className={styles.formSection}>
        After you submit your application, you will see a confirmation page with
        a temporary account number, and you will be able to log in and request
        books and materials. To get your card, follow the confirmation page
        instructions. You may also apply in person at any{" "}
        <a href="#">library location</a> in the Bronx, Manhattan, or Staten
        Island.
      </div>

      <form onSubmit={handleSubmit(submitForm)}>
        <RoutingLinks next={{ submit: true, text: "Submit" }} />
      </form>
    </>
  );
}

export default ReviewFormContainer;
