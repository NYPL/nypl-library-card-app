import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input, Label, InputTypes } from "@nypl/design-system-react-components";
import useFormDataContext from "../../../src/context/FormDataContext";
import { Address } from "../../../src/interfaces";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

/**
 * AddressVerificationPage
 * Main page component for the "address review" page.
 */
function AddressVerificationPage() {
  // Keep track of the user's selection of the preferred home
  // and/or work address.
  const [homeAddressSelect, setHomeAddressSelect] = useState("");
  const [workAddressSelect, setWorkAddressSelect] = useState("");
  // Use react-hook-form for the new radio button input form.
  const { handleSubmit, register } = useForm();
  const { state, dispatch } = useFormDataContext();
  // The `addressResponse` is the value from Service Objects through the NYPL
  // Platform API.
  // The `formValues` object holds all the submitted user values.
  const { formValues, addressResponse } = state;
  const router = useRouter();

  const onChangeHome = (e) => setHomeAddressSelect(e.target?.value);
  const onChangeWork = (e) => setWorkAddressSelect(e.target?.value);
  const homeAddress = addressResponse?.home;
  const workAddress = addressResponse?.work;

  /**
   * extractUpdatedAddressValues
   * Returns an object with either the home or work address values from a
   * larger data object.
   */
  const extractUpdatedAddressValues = (data, addressType) => {
    const updatedValues = {};
    if (data) {
      Object.keys(data).forEach((key) => {
        updatedValues[`${addressType}-${key}`] = data[key];
      });
    }
    return updatedValues;
  };

  const submitForm = (formData) => {
    // These are the values from the radio button inputs if they were rendered.
    const home = formData["home-address-select"];
    const work = formData["work-address-select"];

    let selectedHomeAddress;
    let updatedSelectedHomeAddress = {};
    let selectedWorkAddress;
    let updatedSelectedWorkAddress = {};

    // Was the home address updated?
    // In this case, the home address was vague and the user has to select
    // between multiple valid addresses returned from Service Objects.
    if (home) {
      // Get the index of the object that was selected...
      const idx = parseInt(home.split("-")[1], 10);
      // ...and use the address of the selected object.
      selectedHomeAddress = homeAddress.addresses[idx];
    } else {
      // In this case, the response from Service Objects only returned one
      // address, so that's the updated value.
      selectedHomeAddress = homeAddress.address;
    }

    updatedSelectedHomeAddress = extractUpdatedAddressValues(
      selectedHomeAddress,
      "home"
    );

    // The same idea also follows for the work address, except that it's okay
    // to *not* have a work address at all. If there isn't a work address,
    // there's nothing to update so keep moving forward.
    if (work) {
      const idx = parseInt(work.split("-")[1], 10);
      selectedWorkAddress = workAddress.addresses[idx];
    } else if (workAddress?.message) {
      selectedWorkAddress = workAddress.address;
    }
    updatedSelectedWorkAddress = extractUpdatedAddressValues(
      selectedWorkAddress,
      "work"
    );

    // Merge any updates, specifically to the address value, and continue to
    // the next page.
    dispatch({
      type: "SET_FORM_DATA",
      // Update the existing submitted values with the selected valid address.
      value: {
        ...formValues,
        ...updatedSelectedHomeAddress,
        ...updatedSelectedWorkAddress,
      },
    });

    // Finally, go to the review page.
    router.push("/library-card/review");
  };

  /**
   * renderValidatedAddress
   * Temporary. Just renders the original address submitted by the user if
   * the API response returned other valid addresses.
   */
  const renderValidatedAddress = (address: Address) => (
    <div className="validated-address">
      <span>
        {address.line1} {address.line2}
      </span>
      <br />
      <span>
        {address.city}, {address.state}
      </span>{" "}
      <span>{address.zip}</span>
    </div>
  );

  /**
   * renderMultipleAddresses
   * Renders a list of alternate valid addresses from an invalid/ambiguous
   * user submitted address. Each address is rendered inside a label/input
   * combination so the user can select the right address.
   */
  const renderMultipleAddresses = (
    addresses: Address[],
    addressType,
    selectedValue,
    onChange
  ) => (
    <ul className="multiple-address-list">
      {addresses.map((address, idx) => {
        const selected = `${addressType}-${idx}`;
        const checked = selected === selectedValue;
        const checkedClass = checked ? "checked" : "";
        return (
          <li
            key={`${addressType}-${idx}`}
            className={`radio-field ${checkedClass}`}
          >
            <Label
              id={`${addressType}-${idx}-label`}
              htmlFor={`input-${addressType}-${idx}`}
            >
              <Input
                className="radio-input"
                aria-labelledby={`${addressType}-${idx}-label`}
                id={`${addressType}-${idx}`}
                type={InputTypes.radio}
                attributes={{
                  name: `${addressType}-address-select`,
                  "aria-checked": checked,
                  defaultChecked: checked,
                  onChange,
                }}
                value={selected}
                ref={register()}
              />
              <div>
                <span>
                  {address.line1} {address.line2}
                </span>
                <br />
                <span>
                  {address.city}, {address.state} {address.zip}
                </span>
              </div>
            </Label>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="nypl-row">
      <div className="nypl-column-half nypl-column-offset-one">
        <h2>Step 4 of 6: Address Verification</h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <h3>Home Address</h3>

          {/* If there are multiple addresses,
          render the alternate addresses. */}
          {homeAddress?.addresses?.length > 0 && (
            <>
              <p>
                We have found an alternate home address. Please choose which is
                correct:
              </p>

              {renderMultipleAddresses(
                homeAddress.addresses,
                "home",
                homeAddressSelect,
                onChangeHome
              )}
            </>
          )}
          {/* Otherwise, just render the validated address. */}
          {!homeAddress.addresses &&
            homeAddress?.address?.line1 &&
            renderValidatedAddress(homeAddress.address)}

          {(workAddress?.addresses || workAddress?.address) && (
            <h3>Work Address</h3>
          )}
          {/* If there are multiple work addresses,
          render the alternate addresses. */}
          {workAddress?.addresses?.length > 0 && (
            <>
              <p>
                We have found an alternate work address. Please choose which is
                correct:
              </p>

              {renderMultipleAddresses(
                workAddress.addresses,
                "work",
                workAddressSelect,
                onChangeWork
              )}
            </>
          )}
          {/* If there is a validated work address, render it. */}
          {!workAddress.addresses &&
            workAddress?.address?.line1 &&
            renderValidatedAddress(workAddress.address)}

          <div>
            <input
              className="nypl-request-button"
              type="submit"
              value="Review"
            />
          </div>
        </form>
        <RoutingLinks
          previous={{ url: "/library-card/address" }}
          next={{ url: "/library-card/account" }}
        />
      </div>
    </div>
  );
}

export default AddressVerificationPage;
