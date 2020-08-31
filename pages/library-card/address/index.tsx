import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input, Label, InputTypes } from "@nypl/design-system-react-components";
import useFormDataContext from "../../../src/context/FormDataContext";
import { Address } from "../../../src/interfaces";

/**
 * AddressPage
 * Main page component for the "address review" page.
 */
function AddressPage() {
  const [homeAddressSelect, setHomeAddressSelect] = useState("");
  const [workAddressSelect, setWorkAddressSelect] = useState("");
  const { handleSubmit, register } = useForm();
  const { state, dispatch } = useFormDataContext();
  const { formValues, addressResponse } = state;
  const router = useRouter();

  const onChangeHome = (e) => setHomeAddressSelect(e.target?.value);
  const onChangeWork = (e) => setWorkAddressSelect(e.target?.value);
  const homeAddress = addressResponse?.home;
  const workAddress = addressResponse?.work;

  const extractUpdatedAddressValues = (address, addressType) => {
    const updatedValues = {};
    if (address) {
      Object.keys(address).forEach((key) => {
        updatedValues[`${addressType}-${key}`] = address[key];
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
      // Updating the existing submitted values with the selected valid address.
      value: {
        ...formValues,
        ...updatedSelectedHomeAddress,
        ...updatedSelectedWorkAddress,
      },
    });

    router.push("/library-card/review");
  };

  const renderOriginalAddress = (address: Address) => (
    <div className="original-address">
      <p>Address submitted:</p>
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
        <h2>Confirm your Address</h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <h3>Home Address</h3>
          {homeAddress?.addresses?.length > 0 && (
            <>
              {renderOriginalAddress(homeAddress.address)}

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
          {!homeAddress.addresses &&
            homeAddress?.address?.line1 &&
            renderOriginalAddress(homeAddress.address)}

          {(workAddress?.addresses || workAddress?.address) && (
            <h3>Work Address</h3>
          )}
          {workAddress?.addresses?.length > 0 && (
            <>
              {renderOriginalAddress(workAddress.address)}

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
          {!workAddress.addresses &&
            workAddress?.address?.line1 &&
            renderOriginalAddress(workAddress.address)}

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
