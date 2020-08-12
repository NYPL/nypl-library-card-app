import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ApplicationContainer from "../../../src/components/ApplicationContainer";
import useFormDataContext from "../../../src/context/FormDataContext";
import { useFormContext } from "react-hook-form";

function HomePage() {
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  const formKeys = Object.keys(formValues);

  const submitForm = (formData) => {
    // Merge any updates, specifically to the address value, and continue to
    // the next page.
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formData, ...formValues },
    });

    router.push("/library-card/review");
  };
  return (
    <ApplicationContainer>
      <form onSubmit={handleSubmit(submitForm)}>
        <Link href="/library-card/new">
          {/* eslint-disable-next-line  jsx-a11y/anchor-is-valid */}
          <a>Back</a>
        </Link>
        <div>Please review your address</div>

        {/* Just dummy HTML to render all the values. Eventually we'll
        just need the address data to display any updates. */}
        <ul>
          {formKeys.map((k) => (
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

export default HomePage;
