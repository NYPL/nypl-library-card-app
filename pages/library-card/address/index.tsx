import React from "react";
import { useRouter } from "next/router";
import useFormDataContext from "../../../src/context/FormDataContext";
import { useFormContext } from "react-hook-form";

/**
 * AddressPage
 * Main page component for the "address review" page.
 */
function AddressPage() {
  const { handleSubmit } = useFormContext();
  const { state, dispatch } = useFormDataContext();
  const { formValues, addressResponse } = state;
  const router = useRouter();

  const homeAddress = addressResponse?.home;
  const workAddress = addressResponse?.work;
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
    <div className="nypl-row">
      <div className="nypl-column-half nypl-column-offset-one">
        <h2>Confirm your Address</h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <h3>Home Address</h3>
          {homeAddress?.addresses && (
            <>
              <p>
                We have found alternate home addresses. Please choose the
                correct address:
              </p>
              <ul>
                {homeAddress.addresses.map((address, idx) => (
                  <li key={idx}>
                    <span>
                      {address.line1} {address.line2}
                    </span>
                    <br />
                    <span>
                      {address.city}, {address.state} {address.zip}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {homeAddress?.address?.line1 && (
            <>
              <span>
                {homeAddress.address.line1} {homeAddress.address.line2}
              </span>
              <br />
              <span>
                {homeAddress.address.city}, {homeAddress.address.state}
              </span>{" "}
              <span>{homeAddress.address.zip}</span>
            </>
          )}

          {(workAddress?.addresses || workAddress?.address) && (
            <h3>Work Address</h3>
          )}
          {workAddress?.addresses?.length > 0 ? (
            <>
              <p>
                We have found alternate work addresses. Please choose the
                correct address:
              </p>
              <ul>
                {workAddress.addresses.map((address, idx) => (
                  <li key={idx}>
                    <span>
                      {address.line1} {address.line2}
                    </span>
                    <br />
                    <span>
                      {address.city}, {address.state} {address.zip}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            workAddress?.address?.line1 && (
              <>
                <span>
                  {workAddress.address.line1} {workAddress.address.line2}
                </span>
                <br />
                <span>
                  {workAddress.address.city}, {workAddress.address.state}
                </span>{" "}
                <span>{workAddress.address.zip}</span>
              </>
            )
          )}

          <div>
            <input
              className="nypl-request-button"
              type="submit"
              value="Review"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressPage;
