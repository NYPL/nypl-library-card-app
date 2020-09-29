/* eslint-disable */
import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

import useFormDataContext from "../../context/FormDataContext";
import AddressForm, { AddressTypes } from "../AddressForm";
import RoutingLinks from "../RoutingLinks.tsx";
import LibraryListForm from "../LibraryListForm";
import LocationForm from "../LocationForm";
import ilsLibraryList from "../../data/ilsLibraryList";
import { errorMessages, findLibraryCode } from "../../utils/formDataUtils";
import { Accordion } from "@nypl/design-system-react-components";
import { AddressRenderType, AddressResponse } from "../../interfaces";

const LocationAddressContainer = () => {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    // Convert the home library name to its code value.
    formData.homeLibraryCode = findLibraryCode(formValues.homeLibraryCode);
    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    axios
      .post("/api/address", { formData })
      .then((response) => {
        const home: AddressRenderType = response.data?.home;
        const work: AddressRenderType = response.data?.work;
        // Update the global address state values with ...
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value: { home, work } as AddressResponse,
        });
      })
      .catch((error) => {
        let value: AddressResponse = {
          home: {} as AddressRenderType,
          work: {} as AddressRenderType,
        };
        const home: AddressRenderType = error.response?.data?.home;
        const work: AddressRenderType = error.response?.data?.work;
        if (error.response?.data?.home) {
          value.home = home;
        } else {
          console.log("api failed home, formdata", formData);
        }
        if (error.response?.data?.work) {
          value.work = work;
        } else {
          console.log("api failed work, formdata", formData);
        }
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value,
        });
      })
      // Go to the next page regardless if it's a correct or error response.
      .finally(() =>
        router.push("/library-card/address-verification?newCard=true")
      );
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <LocationForm errorMessage={errorMessages.location} />

      <AddressForm
        type={AddressTypes.Home}
        errorMessages={errorMessages.address}
      />

      <h3>Work Address</h3>
      <Accordion
        id="work-address-accordion"
        accordionLabel="Optional Fields"
        className="work-address-accordion"
      >
        <AddressForm
          type={AddressTypes.Work}
          errorMessages={errorMessages.address}
        />
      </Accordion>

      <LibraryListForm libraryList={ilsLibraryList} />

      <RoutingLinks
        previous={{ url: "/library-card/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default LocationAddressContainer;
