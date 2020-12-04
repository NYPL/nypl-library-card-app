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

    const workAddress = constructAddressType(formData, "work");
    // If the work address wasn't filled out, that's okay, proceed.
    if (
      !workAddress.line1 &&
      !workAddress.city &&
      !workAddress.state &&
      !workAddress.zip
    ) {
      router.push("/address-verification?newCard=true");
    } else {
      // Set the global form state if there's a work address.
      dispatch({
        type: "SET_FORM_DATA",
        value: { ...formValues, ...formData },
      });

      let nextUrl;
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
          // Catch any CSRF token issues and return a generic error message
          // and redirect to the home page.
          if (error.response.status == 403) {
            dispatch({
              type: "SET_FORM_ERRORS",
              value: "A server error occurred validating a token.",
            });
            nextUrl = "/new";
          }
          let work = error.response?.data;
          // If the API call failed because the service is down and there is no
          // returned address data from the response, then display the initial
          // address that the user submitted which is already saved as `workAddress`.
          if (isEmpty(work)) {
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
          // If there's a 403 error, wait a short while before removing the error
          // and going to the home page. Otherwise, go to the next page.
          if (nextUrl === "/new") {
            setTimeout(() => {
              dispatch({ type: "SET_FORM_ERRORS", value: null });
              router.push(nextUrl);
            }, 2500);
          } else {
            setIsLoading(false);
            nextUrl = "/address-verification?newCard=true";
            lcaEvents("Navigation", `Next button to ${nextUrl}`);
            router.push(nextUrl);
          }
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <Loader isLoading={isLoading} />

      <Heading level={3}>Work Address</Heading>
      <p>If you work or go to school in NYC please provide the address.</p>
      <AddressFormFields
        type={AddressTypes.Work}
        errorMessages={errorMessages.address}
      />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <FormField
        id="hidden-work-page"
        type="hidden"
        name="page"
        defaultValue="workAddress"
      />
      <FormField
        id="hidden-form-values"
        type="hidden"
        name="formValues"
        defaultValue={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/location?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AddressContainer;
