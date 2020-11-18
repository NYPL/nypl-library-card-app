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
  Heading,
} from "@nypl/design-system-react-components";
import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
  findLibraryCode,
} from "../../../src/utils/formDataUtils";
import PersonalFormFields from "../PersonalFormFields";
import AccountFormFields from "../AccountFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import styles from "./ReviewFormContainer.module.css";
import AcceptTermsFormFields from "../AcceptTermsFormFields";
import Loader from "../Loader";
import { lcaEvents } from "../../externals/gaUtils";
import { createQueryParams } from "../../utils/utils";
import FormField from "../FormField";

/**
 * ReviewFormContainer
 * Main page component for the "form submission review" page.
 */
function ReviewFormContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues, errorObj } = state;
  const router = useRouter();
  // For routing when javascript is not enabled, we want to track the form
  // values through the URL query params.
  const queryValues = createQueryParams(formValues);
  const [clientSide, setClientSide] = useState(false);
  // Flags to set a section to editable or read-only.
  const [editPersonalInfoFlag, setEditPersonalInfoFlag] = useState(false);
  const [editAccountInfoFlag, setEditAccountInfoFlag] = useState(false);
  const [showPin, setShowPin] = useState(true);
  const checkBoxLabelOptions = {
    id: "showPinId",
    labelContent: <>Show PIN</>,
  };
  const updateShowPin = () => setShowPin(!showPin);

  // Will run whenever the `errorObj` has changes, specifically for
  // bad requests.
  useEffect(() => {
    // The PIN is shown by default when javascript is not enabled. It is hidden
    // once the component renders on the client side.
    setClientSide(true);
    setShowPin(false);

    if (errorObj) {
      document.title = "Form Submission Error | NYPL";
      // When we display errors, we want to go into the "Edit" state so
      // that it's easier to go to input fields from the error messages.
      setEditAccountInfoFlag(true);
      setEditPersonalInfoFlag(true);
    }
  }, [errorObj]);

  /**
   * editSectionButton
   * On initial load, render a simple link to the page where the section can be
   * editted. On the client side when the page mounts, we want to be able to
   * toggle between the "edit" and "view" mode, so render a button to do the
   * toggling instead of an anchor element. This is for the Personal and the
   * Account sections.
   */
  const editSectionButton = (editSectionFlag, sectionName, page) =>
    clientSide ? (
      <Button
        buttonType={ButtonTypes.Primary}
        onClick={() => {
          lcaEvents("Edit", sectionName);
          editSectionFlag(true);
        }}
      >
        Edit
      </Button>
    ) : (
      <a
        href={`/library-card/${page}?${encodeURI(
          `newCard=true${queryValues}`
        )}`}
      >
        Edit
      </a>
    );
  /**
   * editAddressButton
   * The logic from the `editSectionButton` is the same for this function,
   * except that this component is for the Address section.
   */
  const editAddressButton = () =>
    clientSide ? (
      <Button
        buttonType={ButtonTypes.Primary}
        onClick={() => {
          lcaEvents("Edit", "Location/Address");
          router.push("/library-card/location?newCard=true");
        }}
      >
        Edit
      </Button>
    ) : (
      <a
        href={`/library-card/location?${encodeURI(
          `newCard=true${queryValues}`
        )}`}
      >
        Edit
      </a>
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
  const editSectionInfo = (formData, editSectionFlag) => {
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
    // Set the appropriate passed function section to false so it can close
    // independently of the others.
    editSectionFlag(false);
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
      .post("/library-card/api/create-patron", formValues)
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
      {editSectionButton(
        setEditPersonalInfoFlag,
        "Personal Information",
        "personal"
      )}
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
        {/* Only render the toggleable PIN with javascript enabled. */}
        {clientSide ? (
          <>
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
          </>
        ) : (
          <div>{formValues.pin}</div>
        )}
      </div>
      <div className={styles.field}>
        <div className={styles.title}>Home Library</div>
        <div>{findLibraryName(formValues.homeLibraryCode)}</div>
      </div>
      {editSectionButton(
        setEditAccountInfoFlag,
        "Create Your Account",
        "account"
      )}
    </div>
  );
  /**
   * Render a read-only display of all the submitted values from the location
   * and address form section.
   */
  const renderAddressValues = () => (
    <div className={styles.container} id="address-section" tabIndex={0}>
      {/* If there is no location value, don't render this at all -
          there's nothing to show and will just be confusing. */}
      {formValues.location && (
        <div className={styles.field}>
          <div className={styles.title}>Location</div>
          <fieldset>
            {/* For now until we have better tests. This needs a value or an
            empty input and label causes accessibility issues. */}
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
          </fieldset>
        </div>
      )}
      {formValues["work-line1"] && <Heading level={4}>Home</Heading>}
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
          <Heading level={4} className={styles.workTitle}>
            Work
          </Heading>
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

      <div className={styles.formSection}>
        <Heading level={3}>Personal Information</Heading>
        {!editPersonalInfoFlag ? (
          renderPersonalInformationValues()
        ) : (
          <form
            onSubmit={handleSubmit((formData) =>
              editSectionInfo(formData, setEditPersonalInfoFlag)
            )}
          >
            <PersonalFormFields />
            {submitSectionButton}
          </form>
        )}
      </div>

      <div className={styles.formSection}>
        <Heading level={3}>Address</Heading>
        {renderAddressValues()}
      </div>

      <div className={styles.formSection}>
        <Heading level={3}>Create Your Account</Heading>
        {!editAccountInfoFlag ? (
          renderAccountValues()
        ) : (
          <form
            onSubmit={handleSubmit((formData) =>
              editSectionInfo(formData, setEditPersonalInfoFlag)
            )}
          >
            <AccountFormFields showPinOnLoad />
            <AcceptTermsFormFields />
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

      <form
        onSubmit={handleSubmit(submitForm)}
        method="post"
        action="/library-card/api/submit"
      >
        {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
        <FormField
          id="hidden-review-page"
          type="hidden"
          name="page"
          defaultValue="review"
        />
        <FormField
          id="hidden-form-values"
          type="hidden"
          name="formValues"
          defaultValue={JSON.stringify(formValues)}
        />

        <RoutingLinks next={{ submit: true, text: "Submit" }} />
      </form>
    </>
  );
}

export default ReviewFormContainer;
