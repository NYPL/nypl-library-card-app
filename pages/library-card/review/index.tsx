import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";
import config from "../../../appConfig";
import ApplicationContainer from "../../../src/components/ApplicationContainer";
import useFormDataContext from "../../../src/context/FormDataContext";
import { useFormContext } from "react-hook-form";
import { findLibraryCode } from "../../../src/utils/FormValidationUtils";

function HomePage() {
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues, isLoading } = state;
  const router = useRouter();

  const formKeys = Object.keys(formValues);
  const getPatronAgencyType = (agencyTypeParam) => {
    const { agencyType } = config;
    return !isEmpty(agencyTypeParam) && agencyTypeParam.toLowerCase() === "nys"
      ? agencyType.nys
      : agencyType.default;
  };
  const submitForm = (formData) => {
    // This is resetting any errors from previous submissions, if any.
    dispatch({ type: "SET_FORM_ERRORS", value: null });
    // Render the loading component.
    dispatch({ type: "SET_IS_LOADING", value: true });

    formValues.homeLibraryCode = findLibraryCode(formValues.homeLibraryCode);
    const agencyType = getPatronAgencyType(formValues.location);

    const dataToSubmit = { ...formData, ...state.formValues, agencyType };

    // Update the global state.
    dispatch({
      type: "SET_FORM_DATA",
      value: dataToSubmit,
    });

    axios
      .post(
        "/api/create-patron",
        dataToSubmit
        // {
        // headers: { "csrf-token": csrfToken },
        // }
      )
      .then((response) => {
        // Update the global state with a successful form submission data.
        dispatch({ type: "SET_FORM_RESULTS", value: response.data });
        router.push("/confirmation?newCard=true");
      })
      .catch((error) => {
        // There are server-side errors! So we will render them.
        dispatch({ type: "SET_FORM_ERRORS", value: error.response?.data });
        router.push("/library-card/new");
      })
      // Don't render the loading component anymore.
      .finally(() => dispatch({ type: "SET_IS_LOADING", value: false }));
  };

  const renderLoader = () => {
    return isLoading ? <div className="loading" /> : null;
  };

  return (
    <ApplicationContainer>
      <form onSubmit={handleSubmit(submitForm)}>
        <Link href="/library-card/address">
          {/* eslint-disable-next-line  jsx-a11y/anchor-is-valid */}
          <a>Back</a>
        </Link>
        <div>Please review your submission</div>

        <ul>
          {formKeys.map((k) => (
            <li key={k}>
              {k}: {state.formValues[k]}
            </li>
          ))}
        </ul>

        <Link href="/library-card/new">
          {/* eslint-disable-next-line  jsx-a11y/anchor-is-valid */}
          <a>Edit</a>
        </Link>

        <div>
          <input className="nypl-request-button" type="submit" value="Submit" />
          {renderLoader()}
        </div>
      </form>
    </ApplicationContainer>
  );
}

export default HomePage;
