import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

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

const AddressContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues, addressesResponse, csrfToken } = state;
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

    const workAddress = constructAddressType(formData, "work");
    axios
      .post("/library-card/api/address", {
        address: workAddress,
        isWorkAddress: true,
        csrfToken,
      })
      .then((response) => {
        const work: AddressResponse = response.data;
        // Get the home address from the existing submission values
        // and add it to the object along with the work address.
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value: { ...addressesResponse, work } as AddressesResponse,
        });
      })
      .catch((error) => {
        let work = error.response?.data;
        // If the API call failed because the service is down and there is no
        // returned address data from the response, then display the initial
        // address that the user submitted which is already saved as `workAddress`.
        if (!work) {
          work = {
            address: workAddress,
            addresses: [],
            detail: "",
          };
        }
        // Get the home address from the existing submission values
        // and add it to the object along with the work address.
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value: { ...addressesResponse, work } as AddressesResponse,
        });
      })
      // Go to the next page regardless if it's a correct or error response.
      .finally(() => {
        setIsLoading(false);
        const nextUrl = "/address-verification?newCard=true";
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

      <h3>Work Address</h3>
      <AddressFormFields
        type={AddressTypes.Work}
        errorMessages={errorMessages.address}
      />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <input type="hidden" aria-hidden={true} name="page" value="workAddress" />
      <input
        type="hidden"
        aria-hidden={true}
        name="formValues"
        value={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/location?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AddressContainer;
