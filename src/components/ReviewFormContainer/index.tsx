/* eslint-disable */
import {
  Box,
  Button,
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
import AcceptTermsFormFields from "../AcceptTermsFormFields";
import FormField from "../FormField";
import LoadingIndicator from "../LoadingIndicator";

import { createQueryParams } from "../../utils/utils";
import useFormDataContext from "../../../src/context/FormDataContext";
import {
  getLocationValue,
  findLibraryName,
  findLibraryCode,
} from "../../../src/utils/formDataUtils";
import { commonAPIErrors } from "../../data/apiErrorMessageTranslations";
import { NRError } from "../../logger/newrelic";
import { PageSubHeading } from "../PageSubHeading";

const styles = {
  formSection: {
    borderTop: "1px solid",
    borderColor: "ui.gray.medium",
    marginTop: "l",
    paddingTop: "l",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    "@media (max-width: 400px)": {
      display: "inline-block",
      width: "100%",
    },
  },
  field: {
    marginY: "s",
    marginX: 0,
    flex: "1 1 100%",
  },
  multiField: {
    marginY: "s",
    marginX: 0,
    flex: { base: "1 1 100%", md: "1 1 50%" },
  },
  title: {
    fontWeight: "bold",
    marginBottom: "xs",
  },
  workTitle: {
    width: "100%",
    paddingTop: "s",
  },
  editButton: { width: { base: "100%", md: "auto" } },
};

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
  const editSectionButton = (editSectionFlag, sectionName, page) => {
    const label = `${t("button.edit")} ${
      page === "personal"
        ? t(`review.section.personal`)
        : t("review.createAccount")
    }`;
    return clientSide ? (
      <Button
        variant="secondary"
        id={`editSectionButton-${sectionName.replace(/\s+/g, "")}`}
        onClick={() => {
          editSectionFlag(true);
        }}
        aria-label={label}
        sx={styles.editButton}
      >
        {t("button.edit")}
      </Button>
    ) : (
      <a
        aria-label={label}
        href={`/library-card/${page}?${encodeURI(`${queryStr}${queryValues}`)}`}
      >
        {t("button.edit")}
      </a>
    );
  };
  /**
   * editAddressButton
   * The logic from the `editSectionButton` is the same for this function,
   * except that this component is for the Address section.
   */
  const editAddressButton = () => {
    const label = `${t("button.edit")} ${t("review.section.address.label")}`;
    return clientSide ? (
      <Button
        variant="secondary"
        id="editAddressButton"
        onClick={async () => {
          await router.push(`/location?${queryStr}`);
        }}
        aria-label={label}
        sx={styles.editButton}
      >
        {t("button.edit")}
      </Button>
    ) : (
      <a
        aria-label={label}
        href={`/library-card/location?${encodeURI(
          `${queryStr}${queryValues}`
        )}`}
      >
        {t("button.edit")}
      </a>
    );
  };

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
      value: { ...formValues, ...getValues() },
    });

    axios
      .post("/library-card/api/create-patron", {
        ...formValues,
        ...getValues(),
        csrfToken,
      })
      .then(async (response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });
        await router.push(`/congrats?${queryStr}`);
      })
      .catch((error) => {
        NRError(
          new Error(`Error Creating New Account. ${JSON.stringify(error)}`),
          {
            customAttributes: {
              contactForm: `Error Creating New Account. ${JSON.stringify(
                error
              )}`,
            },
          }
        );
        setIsLoading(false);
        // Catch any CSRF token issues and return a generic error message
        // and redirect to the home page.
        if (error.response.status == 403) {
          dispatch({
            type: "SET_FORM_ERRORS",
            value: commonAPIErrors.errorValidatingToken,
          });
          // After a while, remove the errors and redirect to the home page.
          setTimeout(async () => {
            dispatch({ type: "SET_FORM_ERRORS", value: null });
            await router.push("/new");
          }, 2500);
        } else {
          // There are server-side errors! Display them to the user
          // so they can be fixed.
          dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
        }
      });
  };

  /**
   * Render a read-only display of all the submitted values from the personal
   * information form section.
   */
  const renderPersonalInformationValues = () => (
    <Box sx={styles.container}>
      <Box sx={styles.multiField}>
        <Box sx={styles.title}>{t("personal.firstName.label")}</Box>
        <Box>{formValues.firstName}</Box>
      </Box>
      <Box sx={styles.multiField}>
        <Box sx={styles.title}>{t("personal.lastName.label")}</Box>
        <Box>{formValues.lastName}</Box>
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("personal.birthdate.label")}</Box>
        <Box>{formValues.birthdate}</Box>
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("personal.email.label")}</Box>
        <Box>{formValues.email}</Box>
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("review.receiveNewsletter")}</Box>
        <Box>
          {formValues.ecommunicationsPref ? t("review.yes") : t("review.no")}
        </Box>
      </Box>
      {editSectionButton(
        setEditPersonalInfoFlag,
        "Personal information",
        "personal"
      )}
    </Box>
  );
  /**
   * Render a read-only display of all the submitted values from the account
   * form section.
   */
  const renderAccountValues = () => (
    <Box sx={styles.container}>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("account.username.label")}</Box>
        <Box>{formValues.username}</Box>
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("account.password.label")}</Box>
        {/* Only render the toggleable password with javascript enabled. */}
        {clientSide ? (
          <>
            <Box>
              {showPassword
                ? formValues.password
                : "*".repeat(formValues.password?.length)}
            </Box>
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
          <Box>{formValues.password}</Box>
        )}
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("review.section.homeLibrary")}</Box>
        <Box>{findLibraryName(formValues.homeLibraryCode)}</Box>
      </Box>
      {editSectionButton(
        setEditAccountInfoFlag,
        "Create your account",
        "account"
      )}
    </Box>
  );
  /**
   * Render a read-only display of all the submitted values from the location
   * and address form section.
   */
  const renderAddressValues = () => (
    <Box sx={styles.container} id="address-section">
      {/* If there is no location value, don't render this at all -
          there's nothing to show and will just be confusing. */}
      {formValues.location && (
        <Box sx={styles.field}>
          <Box sx={styles.title}>{t("review.section.address.location")}</Box>
          <Radio
            className="radio-input"
            id="review-location-id"
            isChecked={true}
            labelText={getLocationValue(formValues.location, lang as string)}
            name={"location"}
            value={formValues.location}
          />
        </Box>
      )}
      {formValues["work-line1"] && (
        <Heading level="h4" size="heading7">
          {t("review.section.address.home")}
        </Heading>
      )}
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("location.address.line1.label")}</Box>
        <Box>{formValues["home-line1"]}</Box>
      </Box>
      {formValues["home-line2"] && (
        <Box sx={styles.field}>
          <Box sx={styles.title}>{t("location.address.line2.label")}</Box>
          <Box>{formValues["home-line2"]}</Box>
        </Box>
      )}
      <Box sx={styles.multiField}>
        <Box sx={styles.title}>{t("location.address.city.label")}</Box>
        <Box>{formValues["home-city"]}</Box>
      </Box>
      <Box sx={styles.multiField}>
        <Box sx={styles.title}>{t("location.address.state.label")}</Box>
        <Box>{formValues["home-state"]}</Box>
      </Box>
      <Box sx={styles.field}>
        <Box sx={styles.title}>{t("location.address.postalCode.label")}</Box>
        <Box>{formValues["home-zip"]}</Box>
      </Box>
      {formValues["work-line1"] && (
        <>
          <Heading level="h4" sx={styles.workTitle} size="heading7">
            {t("review.section.address.work")}
          </Heading>
          <Box sx={styles.field}>
            <Box sx={styles.title}>{t("location.address.line1.label")}</Box>
            <Box>{formValues["work-line1"]}</Box>
          </Box>
          {formValues["work-line2"] && (
            <Box sx={styles.field}>
              <Box sx={styles.title}>{t("location.address.line2.label")}</Box>
              <Box>{formValues["work-line2"]}</Box>
            </Box>
          )}
          <Box sx={styles.multiField}>
            <Box sx={styles.title}>{t("location.address.city.label")}</Box>
            <Box>{formValues["work-city"]}</Box>
          </Box>
          <Box sx={styles.multiField}>
            <Box sx={styles.title}>{t("location.address.state.label")}</Box>
            <Box>{formValues["work-state"]}</Box>
          </Box>
          <Box sx={styles.field}>
            <Box sx={styles.title}>
              {t("location.address.postalCode.label")}
            </Box>
            <Box>{formValues["work-zip"]}</Box>
          </Box>
        </>
      )}

      {editAddressButton()}
    </Box>
  );

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />

      <Box sx={styles.formSection}>
        <PageSubHeading mb="s">{t("review.section.personal")}</PageSubHeading>
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
      </Box>

      <Box sx={styles.formSection}>
        <PageSubHeading mb="s">
          {t("review.section.address.label")}
        </PageSubHeading>
        {renderAddressValues()}
      </Box>

      <Box sx={styles.formSection}>
        <PageSubHeading mb="s">{t("review.createAccount")}</PageSubHeading>
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
      </Box>

      <Box sx={styles.formSection}>{t("review.nextStep")}</Box>

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
              next={{
                submit: true,
                text: t("button.submit"),
              }}
            />
          </DSFormField>
        </FormRow>
      </Form>
    </>
  );
}

export default ReviewFormContainer;
