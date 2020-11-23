import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import { Heading } from "@nypl/design-system-react-components";
import isEmpty from "lodash/isEmpty";

import useFormDataContext from "../../context/FormDataContext";
import AddressFormFields from "../AddressFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import { errorMessages, constructAddressType } from "../../utils/formDataUtils";
import {
  AddressResponse,
  AddressesResponse,
  AddressTypes,
} from "../../interfaces";
import Loader from "../Loader";
import { lcaEvents } from "../../externals/gaUtils";
import FormField from "../FormField";

const AddressContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);

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
        let home = error.response?.data;
        // If the API call failed because the service is down and there is no
        // returned address data from the response, then display the initial
        // address that the user submitted which we already saved in `homeAddress`.
        if (isEmpty(home)) {
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
        if (formValues.location !== "nyc") {
          nextUrl = "/workAddress?newCard=true";
        } else {
          nextUrl = "/address-verification?newCard=true";
        }

        lcaEvents("Navigation", `Next button to ${nextUrl}`);
        router.push(nextUrl);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <Loader isLoading={isLoading} />

      <Heading level={3}>Home Address</Heading>
      <p>If you live in NYC, please fill out the home address form.</p>
      <AddressFormFields
        type={AddressTypes.Home}
        errorMessages={errorMessages.address}
      />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <FormField
        id="hidden-location-page"
        type="hidden"
        name="page"
        defaultValue="location"
      />
      <FormField
        id="hidden-form-values"
        type="hidden"
        name="formValues"
        defaultValue={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AddressContainer;
