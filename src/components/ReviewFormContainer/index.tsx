/* eslint-disable */
import {
  Button,
  ButtonGroup,
  Checkbox,
  Form,
  FormField as DSFormField,
  FormRow,
  Heading,
  Radio,
} from "@nypl/design-system-react-components";
import axios from "axios";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";

import PersonalFormFields from "../PersonalFormFields";
import AccountFormFields from "../AccountFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import styles from "./ReviewFormContainer.module.css";
import AcceptTermsFormFields from "../AcceptTermsFormFields";
import Loader from "../Loader";
import FormField from "../FormField";

import aaUtils from "../../externals/aaUtils";
import { createQueryParams } from "../../utils/utils";
import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
  findLibraryCode,
} from "../../../src/utils/formDataUtils";
import { commonAPIErrors } from "../../data/apiErrorMessageTranslations";

/**
 * ReviewFormContainer
 * Main page component for the "form submission review" page.
 */
function ReviewFormContainer({ csrfToken }) {
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, getValues } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues, errorObj } = state;
  const router = useRouter();
  const {
    query: { lang = "en" },
  } = router;
  // For routing when javascript is not enabled, we want to track the form
  // values through the URL query params.
  const queryValues = createQueryParams(formValues);
  // Get the URL query params for `newCard` and `lang`.
  const queryStr = createQueryParams(router?.query);
  const [clientSide, setClientSide] = useState(false);
  // Flags to set a section to editable or read-only.
  const [editPersonalInfoFlag, setEditPersonalInfoFlag] = useState(false);
  const [editAccountInfoFlag, setEditAccountInfoFlag] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const updateShowPassword = () => setShowPassword(!showPassword);

  // Will run whenever the `errorObj` has changes, specifically for
  // bad requests.
  useEffect(() => {
    // The password is shown by default when javascript is not enabled. It is
    // hidden once the component renders on the client side.
    setClientSide(true);
    setShowPassword(false);

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
        buttonType="primary"
        id={`editSectionButton-${sectionName}`}
        onClick={() => {
          editSectionFlag(true);
        }}
      >
        {t("button.edit")}
      </Button>
    ) : (
      <a
        href={`/library-card/${page}?${encodeURI(`${queryStr}${queryValues}`)}`}
      >
        {t("button.edit")}
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
        buttonType="primary"
        id="editAddressButton"
        onClick={() => {
          router.push(`/location?${queryStr}`);
        }}
      >
        {t("button.edit")}
      </Button>
    ) : (
      <a
        href={`/library-card/location?${encodeURI(
          `${queryStr}${queryValues}`
        )}`}
      >
        {t("button.edit")}
      </a>
    );

  /**
   * editSectionInfo
   * Each section has its own form and needs its own edit button, but the data
   * is not being manipulated, just updated, so they can all use the same
   * function to set the global data.
   */
  const editSectionInfo = (formData, editSectionFlag) => {
    if (formData.location) {
      formData.homeLibraryCode = findLibraryCode(formData.location);
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
      value: {...formValues, ...getValues()},
    });

    axios
      .post("/library-card/api/create-patron", { ...formValues, ...getValues(), csrfToken })
      .then((response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });

        // Adobe Analytics
        aaUtils.trackApplicationSubmitEvent({
          id: null,
          lang: formValues.preferredLanguage,
          locationId: formValues.homeLibraryCode,
          locationName: findLibraryName(formValues.homeLibraryCode),
        });
        router.push(`/congrats?${queryStr}`);
      })
      .catch((error) => {
        // Catch any CSRF token issues and return a generic error message
        // and redirect to the home page.
        if (error.response.status == 403) {
          dispatch({
            type: "SET_FORM_ERRORS",
            value: commonAPIErrors.errorValidatingToken,
          });
          // After a while, remove the errors and redirect to the home page.
          setTimeout(() => {
            dispatch({ type: "SET_FORM_ERRORS", value: null });
            router.push("/new");
          }, 2500);
        } else {
          // There are server-side errors! Display them to the user
          // so they can be fixed.
          dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
        }
        setIsLoading(false);
      });
  };

  /**
   * Render a read-only display of all the submitted values from the personal
   * information form section.
   */
  const renderPersonalInformationValues = () => (
    <div className={styles.container}>
      <div className={styles.multiField}>
        <div className={styles.title}>{t("personal.firstName.label")}</div>
        <div>{formValues.firstName}</div>
      </div>
      <div className={styles.multiField}>
        <div className={styles.title}>{t("personal.lastName.label")}</div>
        <div>{formValues.lastName}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>{t("personal.birthdate.label")}</div>
        <div>{formValues.birthdate}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>{t("personal.email.label")}</div>
        <div>{formValues.email}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>{t("review.receiveNewsletter")}</div>
        <div>
          {formValues.ecommunicationsPref ? t("review.yes") : t("review.no")}
        </div>
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
        <div className={styles.title}>{t("account.username.label")}</div>
        <div>{formValues.username}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>{t("account.password.label")}</div>
        {/* Only render the toggleable password with javascript enabled. */}
        {clientSide ? (
          <>
            <div>
              {showPassword
                ? formValues.password
                : "*".repeat(formValues.password?.length)}
            </div>
            <Checkbox
              id="showPasswordReview"
              name="showPasswordReview"
              labelText={t("account.showPassword")}
              isChecked={showPassword}
              onChange={updateShowPassword}
              mt="s"
            />
          </>
        ) : (
          <div>{formValues.password}</div>
        )}
      </div>
      <div className={styles.field}>
        <div className={styles.title}>{t("review.section.homeLibrary")}</div>
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
          <div className={styles.title}>
            {t("review.section.address.location")}
          </div>
          <Radio
            className="radio-input"
            id="review-location-id"
            isChecked={true}
            labelText={getLocationValue(formValues.location, lang as string)}
            name={"location"}
            value={formValues.location}
          />
        </div>
      )}
      {formValues["work-line1"] && (
        <Heading level="four">{t("review.section.address.home")}</Heading>
      )}
      <div className={styles.field}>
        <div className={styles.title}>{t("location.address.line1.label")}</div>
        <div>{formValues["home-line1"]}</div>
      </div>
      {formValues["home-line2"] && (
        <div className={styles.field}>
          <div className={styles.title}>
            {t("location.address.line2.label")}
          </div>
          <div>{formValues["home-line2"]}</div>
        </div>
      )}
      <div className={styles.multiField}>
        <div className={styles.title}>{t("location.address.city.label")}</div>
        <div>{formValues["home-city"]}</div>
      </div>
      <div className={styles.multiField}>
        <div className={styles.title}>{t("location.address.state.label")}</div>
        <div>{formValues["home-state"]}</div>
      </div>
      <div className={styles.field}>
        <div className={styles.title}>
          {t("location.address.postalCode.label")}
        </div>
        <div>{formValues["home-zip"]}</div>
      </div>
      {formValues["work-line1"] && (
        <>
          <Heading level="four" className={styles.workTitle}>
            {t("review.section.address.work")}
          </Heading>
          <div className={styles.field}>
            <div className={styles.title}>
              {t("location.address.line1.label")}
            </div>
            <div>{formValues["work-line1"]}</div>
          </div>
          {formValues["work-line2"] && (
            <div className={styles.field}>
              <div className={styles.title}>
                {t("location.address.line2.label")}
              </div>
              <div>{formValues["work-line2"]}</div>
            </div>
          )}
          <div className={styles.multiField}>
            <div className={styles.title}>
              {t("location.address.city.label")}
            </div>
            <div>{formValues["work-city"]}</div>
          </div>
          <div className={styles.multiField}>
            <div className={styles.title}>
              {t("location.address.state.label")}
            </div>
            <div>{formValues["work-state"]}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.title}>
              {t("location.address.postalCode.label")}
            </div>
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
        <Heading level="three">{t("review.section.personal")}</Heading>
        {!editPersonalInfoFlag ? (
          renderPersonalInformationValues()
        ) : (
          <Form
            id="review-form-personal-fields"
            onSubmit={handleSubmit((formData) =>
              editSectionInfo(formData, setEditPersonalInfoFlag)
            )}
          >
            <PersonalFormFields />
          </Form>
        )}
      </div>

      <div className={styles.formSection}>
        <Heading level="three">{t("review.section.address.label")}</Heading>
        {renderAddressValues()}
      </div>

      <div className={styles.formSection}>
        <Heading level="three">{t("review.createAccount")}</Heading>
        {!editAccountInfoFlag ? (
          renderAccountValues()
        ) : (
          <Form
            id="review-form-account-fields"
            onSubmit={handleSubmit((formData) =>
              editSectionInfo(formData, setEditPersonalInfoFlag)
            )}
          >
            <AccountFormFields
              id="review-form-account-fields"
              showPasswordOnLoad
              csrfToken={csrfToken}
            />
            <AcceptTermsFormFields />
          </Form>
        )}
      </div>

      <div className={styles.formSection}>{t("review.nextStep")}</div>

      <Form
        // action="/library-card/api/submit"
        id="review-submit"
        method="post"
        onSubmit={handleSubmit(submitForm)}
        mt="20px"
      >
        <FormRow display="none">
          <DSFormField>
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
          </DSFormField>
        </FormRow>

        <FormRow margin-top="20px">
          <DSFormField>
            <RoutingLinks
              isDisabled={isLoading}
              next={{ submit: true, text: t("button.submit") }}
            />
          </DSFormField>
        </FormRow>
      </Form>
    </>
  );
}

export default ReviewFormContainer;
