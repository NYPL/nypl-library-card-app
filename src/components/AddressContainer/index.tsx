import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

import useFormDataContext from "../../context/FormDataContext";
import AddressForm from "../AddressForm";
import RoutingLinks from "../RoutingLinks.tsx";
import { errorMessages, constructAddressType } from "../../utils/formDataUtils";
import {
  AddressResponse,
  AddressesResponse,
  AddressTypes,
} from "../../interfaces";
import Loader from "../Loader";
import { lcaEvents } from "../../externals/gaUtils";
import useIPLocationContext from "../../context/IPLocationContext";
import { getLocationValueFromResponse } from "../../utils/IPLocationAPI";

const LocationAddressContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();
  // Get the user's location from the geolocation API based on their IP address.
  const userLocationResponse = useIPLocationContext();
  // Convert the response to the default value that should be selected in the
  // UI. If the geolocation API failed, no option will be selected by default.
  // Even though this location value is pre-selected, users should still be
  // able to update their location in the UI.
  const userLocation = getLocationValueFromResponse(userLocationResponse);

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = (formData) => {
    setIsLoading(true);

    // Manually set the user's location in the form data.
    formData.location = userLocation;

    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    const homeAddress = constructAddressType(formData, "home");
    axios
      .post("/library-card/api/address", {
        address: homeAddress,
        isWorkAddress: false,
      })
      .then((response) => {
        const home: AddressResponse = response.data;
        // Update the global address state values with ...
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value: { home } as AddressesResponse,
        });
      })
      .catch((error) => {
        console.log("error", error.response);
        let home = error.response?.data;
        // If the API call failed because the service is down and there is no
        // returned address data from the response, then display the initial
        // address that the user submitted which we already saved in `homeAddress`.
        if (!home) {
          home = {
            address: homeAddress,
            addresses: [],
            detail: "",
          };
        }
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value: { home },
        });
      })
      .finally(() => {
        let nextUrl;
        setIsLoading(false);
        // If the user is not in "nyc", then we ask the user for their
        // work address information. Otherwise, the home address is enough
        // and we can go to the next step.
        if (userLocation !== "nyc") {
          nextUrl = "/workAddress?newCard=true";
        } else {
          nextUrl = "/address-verification?newCard=true";
        }

        lcaEvents("Navigation", `Next button to ${nextUrl}`);
        router.push(nextUrl);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Loader isLoading={isLoading} />

      <h3>Home Address</h3>
      <p>If you live in NYC, please fill out the home address form.</p>
      <AddressForm
        type={AddressTypes.Home}
        errorMessages={errorMessages.address}
      />

      <RoutingLinks
        previous={{ url: "/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default LocationAddressContainer;
