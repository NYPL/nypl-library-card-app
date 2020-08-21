import React, { useState } from "react";
import { useRouter } from "next/router";
import useFormDataContext from "../../../src/context/FormDataContext";
import { useForm } from "react-hook-form";
import { Input, Label, InputTypes } from "@nypl/design-system-react-components";

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
  console.log("homeAddress", homeAddress);

  const submitForm = (formData) => {
    console.log("formData", formData);
    let updatedFormValues;
    const home = formData["home-address-select"];
    const work = formData["work-address-select"];
    if (home) {
      const idx = parseInt(home.split("-")[1], 10);
      const selectedHomeAddress = homeAddress.addresses[idx];
      const updatedSelectedHomeAddress = {};
      Object.keys(selectedHomeAddress).forEach((key) => {
        updatedSelectedHomeAddress[`home-${key}`] = selectedHomeAddress[key];
      });
      updatedFormValues = {
        ...formValues,
        ...updatedSelectedHomeAddress,
      };
    } else {
      const selectedHomeAddress = homeAddress.address;
      const updatedSelectedHomeAddress = {};
      Object.keys(selectedHomeAddress).forEach((key) => {
        updatedSelectedHomeAddress[`home-${key}`] = selectedHomeAddress[key];
      });
      updatedFormValues = {
        ...formValues,
        ...updatedSelectedHomeAddress,
      };
    }

    if (work) {
      const idx = parseInt(work.split("-")[1], 10);
      const selectedWorkAddress = workAddress.addresses[idx];
      const updatedSelectedWorkAddress = {};
      Object.keys(selectedWorkAddress).forEach((key) => {
        updatedSelectedWorkAddress[`work-${key}`] = selectedWorkAddress[key];
      });
      updatedFormValues = {
        ...updatedFormValues,
        ...updatedSelectedWorkAddress,
      };
    } else if (workAddress) {
      const selectedWorkAddress = workAddress.address;
      const updatedSelectedWorkAddress = {};
      Object.keys(selectedWorkAddress).forEach((key) => {
        updatedSelectedWorkAddress[`work-${key}`] = selectedWorkAddress[key];
      });
      updatedFormValues = {
        ...updatedFormValues,
        ...updatedSelectedWorkAddress,
      };
    }

    console.log("updatedFormValues", updatedFormValues);

    // Merge any updates, specifically to the address value, and continue to
    // the next page. For now, it's only setting up the dispatch.
    // dispatch({
    //   type: "SET_FORM_DATA",
    //   value: updatedFormValues,
    // });

    // router.push("/library-card/review");
  };

  return (
    <div className="nypl-row">
      <div className="nypl-column-half nypl-column-offset-one">
        <h2>Confirm your Address</h2>
        <form onSubmit={handleSubmit(submitForm)}>
          <h3>Home Address</h3>
          {homeAddress?.addresses?.length > 0 && (
            <>
              <div className="original-address">
                <p>Address submitted:</p>
                <span>
                  {homeAddress.address.line1} {homeAddress.address.line2}
                </span>
                <br />
                <span>
                  {homeAddress.address.city}, {homeAddress.address.state}
                </span>{" "}
                <span>{homeAddress.address.zip}</span>
              </div>
              <p>
                We have found an alternate home address. Please choose which is
                correct:
              </p>
              <ul className="multiple-address-list">
                {homeAddress.addresses.map((address, idx) => {
                  const selected = `home-${idx}`;
                  const checked = selected === homeAddressSelect;
                  const checkedClass = checked ? "checked" : "";
                  return (
                    <li
                      key={`home-${idx}`}
                      className={`radio-field ${checkedClass}`}
                    >
                      <Label
                        id={`home-${idx}-label`}
                        htmlFor={`input-home-${idx}`}
                      >
                        <Input
                          className="radio-input"
                          aria-labelledby={`home-${idx}-label`}
                          id={`home-${idx}`}
                          type={InputTypes.radio}
                          attributes={{
                            name: "home-address-select",
                            "aria-checked": checked,
                            defaultChecked: checked,
                            onChange: onChangeHome,
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
            </>
          )}
          {!homeAddress.addresses && homeAddress?.address?.line1 && (
            <div className="original-address">
              <span>
                {homeAddress.address.line1} {homeAddress.address.line2}
              </span>
              <br />
              <span>
                {homeAddress.address.city}, {homeAddress.address.state}
              </span>{" "}
              <span>{homeAddress.address.zip}</span>
            </div>
          )}

          {(workAddress?.addresses || workAddress?.address) && (
            <h3>Work Address</h3>
          )}
          {workAddress?.addresses?.length > 0 && (
            <>
              <div className="original-address">
                <p>Address submitted:</p>
                <span>
                  {workAddress.address.line1} {workAddress.address.line2}
                </span>
                <br />
                <span>
                  {workAddress.address.city}, {workAddress.address.state}
                </span>{" "}
                <span>{workAddress.address.zip}</span>
              </div>
              <p>
                We have found an alternate work address. Please choose which is
                correct:
              </p>
              <ul className="multiple-address-list">
                {workAddress.addresses.map((address, idx) => {
                  const selected = `work-${idx}`;
                  const checked = selected === workAddressSelect;
                  const checkedClass = checked ? "checked" : "";
                  return (
                    <li
                      key={`work-${idx}`}
                      className={`radio-field ${checkedClass}`}
                    >
                      <Label
                        id={`work-${idx}-label`}
                        htmlFor={`input-work-${idx}`}
                      >
                        <Input
                          className="radio-input"
                          aria-labelledby={`work-${idx}-label`}
                          id={`work-${idx}`}
                          type={InputTypes.radio}
                          attributes={{
                            name: "work-address-select",
                            "aria-checked": checked,
                            defaultChecked: checked,
                            onChange: onChangeWork,
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
            </>
          )}
          {!workAddress.addresses && workAddress?.address?.line1 && (
            <div className="original-address">
              <span>
                {workAddress.address.line1} {workAddress.address.line2}
              </span>
              <br />
              <span>
                {workAddress.address.city}, {workAddress.address.state}
              </span>{" "}
              <span>{workAddress.address.zip}</span>
            </div>
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
