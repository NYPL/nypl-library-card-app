import React from "react";
import { useRouter } from "next/router";
import ApplicationContainer from "../../../src/components/ApplicationContainer";
import useFormDataContext from "../../../src/context/FormDataContext";
import { useFormContext } from "react-hook-form";

const addressKeys = [
  "home-line1",
  "home-line2",
  "home-city",
  "home-state",
  "home-zip",
  "work-line1",
  "work-line2",
  "work-city",
  "work-state",
  "work-zip",
];

/**
 * AddressPage
 * Main page component for the "address review" page.
 */
function AddressPage() {
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();

  const submitForm = (formData) => {
    // Merge any updates, specifically to the address value, and continue to
    // the next page. For now, it's only setting up the dispatch.
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formData, ...formValues },
    });

    router.push("/library-card/review");
  };

  return (
    <ApplicationContainer>
      <h2>Confirm your Address</h2>
      <form onSubmit={handleSubmit(submitForm)}>
        <h3>
          We have found an alternate address for you. Please choose which is
          correct:
        </h3>
        {/* Just dummy HTML to render all the values. Eventually we'll
        just need the address data to display any updates. */}
        <ul>
          {addressKeys.map((k) => (
            <li key={k}>
              {k}: {formValues[k]}
            </li>
          ))}
        </ul>

        <input className="nypl-request-button" type="submit" value="Review" />
      </form>
    </ApplicationContainer>
  );
}

export default AddressPage;
