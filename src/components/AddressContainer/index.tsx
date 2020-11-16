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
  const { formValues, csrfToken } = state;
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
    let nextUrl;
    axios
      .post("/library-card/api/address", {
        address: homeAddress,
        isWorkAddress: false,
        csrfToken,
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
        // Catch any CSRF token issues and return a generic error message
        // and redirect to the home page.
        if (error.response.status == 403) {
          dispatch({
            type: "SET_FORM_ERRORS",
            value: "A server error occurred validating a token.",
          });
          nextUrl = "/new";
        }
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
        setIsLoading(false);
        // If we don't have a 403 error and need to start over, then do the
        // following check:
        // If the user is not in "nyc", then we ask the user for their
        // work address information. Otherwise, the home address is enough
        // and we can go to the next step.
        if (nextUrl !== "/new") {
          if (formValues.location !== "nyc") {
            nextUrl = "/workAddress?newCard=true";
          } else {
            nextUrl = "/address-verification?newCard=true";
          }
          lcaEvents("Navigation", `Next button to ${nextUrl}`);
          router.push(nextUrl);
        } else {
          setTimeout(() => {
            dispatch({ type: "SET_FORM_ERRORS", value: null });
            router.push(nextUrl);
          }, 2500);
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      method="post"
      action="/library-card/api/submit"
    >
      <Loader isLoading={isLoading} />

      <h3>Home Address</h3>
      <p>If you live in NYC, please fill out the home address form.</p>
      <AddressFormFields
        type={AddressTypes.Home}
        errorMessages={errorMessages.address}
      />

      {/* Not register to react-hook-form because we only want to
          use this value for the no-js scenario. */}
      <input type="hidden" aria-hidden={true} name="page" value="location" />
      <input
        type="hidden"
        aria-hidden={true}
        name="formValues"
        value={JSON.stringify(formValues)}
      />

      <RoutingLinks
        previous={{ url: "/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default AddressContainer;
