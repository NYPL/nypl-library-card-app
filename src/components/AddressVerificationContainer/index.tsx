import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Input, Label, InputTypes } from "@nypl/design-system-react-components";
import useFormDataContext from "../../../src/context/FormDataContext";
import { Address, AddressRenderType } from "../../../src/interfaces";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";
import styles from "./AddressVerificationContainer.module.css";

/**
 * AddressVerificationContainer
 * Main page component for the "address review" page.
 */
function AddressVerificationContainer() {
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

  /**
   * getAddresses
   * Returns an array of a single or multiple addresses returned from the API
   * call to Service Objects. If there was response (could be from no input),
   * then just return undefined. That's the case for the optional work address.
   * We want an array so we always render the list of radio buttons, even if
   * there's only one option.
   */
  const getAddresses = (addressObj: AddressRenderType): Address[] => {
    if (!addressObj?.address) {
      return;
    }
    if (addressObj?.addresses?.length) {
      return addressObj.addresses;
    }
    return [addressObj.address];
  };

  const onChangeHome = (e) => setHomeAddressSelect(e.target?.value);
  const onChangeWork = (e) => setWorkAddressSelect(e.target?.value);
  const homeAddress = getAddresses(addressResponse?.home);
  const workAddress = getAddresses(addressResponse?.work);

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

    let updatedSelectedHomeAddress = {};
    let selectedWorkAddress;
    let updatedSelectedWorkAddress = {};

    // Was the home address updated?
    // In this case, the home address was vague and the user has to select
    // between multiple valid addresses returned from Service Objects.

    // Get the index of the object that was selected...
    const idx = parseInt(home.split("-")[1], 10);
    // ...and use the address of the selected object.
    const selectedHomeAddress = homeAddress[idx];

    updatedSelectedHomeAddress = extractUpdatedAddressValues(
      selectedHomeAddress,
      "home"
    );

    // The same idea also follows for the work address, except that it's okay
    // to *not* have a work address at all. If there isn't a work address,
    // there's nothing to update so keep moving forward.
    if (work) {
      const idx = parseInt(work.split("-")[1], 10);
      selectedWorkAddress = workAddress[idx];
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

    // Finally, go to the acount page.
    router.push("/library-card/account?newCard=true");
  };

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
  ) => {
    if (!addresses?.length) {
      return null;
    }
    const addressesLength = addresses.length;
    return (
      <ul className={styles.multiple_address_list}>
        {addresses.map((address, idx) => {
          const selected = `${addressType}-${idx}`;
          // If there's only one option, it's checked by default. Otherwise,
          // the user can choose between the two options.
          const checked =
            addressesLength === 1 ? true : selected === selectedValue;
          const checkedClass = checked ? "checked" : "";
          return (
            <li
              key={`${addressType}-${idx}`}
              className={`radio-field ${checkedClass}`}
            >
              <Label
                className={styles.label}
                id={`${addressType}-${idx}-label`}
                htmlFor={`input-${addressType}-${idx}`}
              >
                <Input
                  className={`radio-input ${styles.input}`}
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
                  ref={register({
                    required: true,
                  })}
                />
                <div>
                  <div>{address.line1}</div>
                  {address.line2 && <div>{address.line2}</div>}
                  <div>
                    {address.city}, {address.state} {address.zip}
                  </div>
                </div>
              </Label>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <p>Home Address</p>

      {renderMultipleAddresses(
        homeAddress,
        "home",
        homeAddressSelect,
        onChangeHome
      )}

      {workAddress?.length > 0 && (
        <>
          <p>Work Address</p>

          {renderMultipleAddresses(
            workAddress,
            "work",
            workAddressSelect,
            onChangeWork
          )}
        </>
      )}

      <RoutingLinks
        previous={{ url: "/library-card/location?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
}

export default AddressVerificationContainer;
