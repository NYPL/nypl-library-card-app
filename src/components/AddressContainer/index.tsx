import {
  Form,
  FormField as DSFormField,
  FormRow,
  Heading,
} from "@nypl/design-system-react-components";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import useFormDataContext from "../../context/FormDataContext";
import AddressFormFields from "../AddressFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import {
  AddressResponse,
  AddressesResponse,
  AddressTypes,
} from "../../interfaces";
import Loader from "../Loader";
import FormField from "../FormField";
import { constructAddressType } from "../../utils/formDataUtils";
import { lcaEvents } from "../../externals/gaUtils";
import { nyCounties, nyCities } from "../../utils/utils";

const AddressContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues, csrfToken } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();
  console.log("AddressContainer router", router);

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

    // This is the home address from the form fields.
    const homeAddress = constructAddressType(formData, "home");
    // This is either the updated address from the API request or the address
    // entered in the form.
    let updatedHomeAddress;
    let nextUrl;
    axios
      .post("/library-card/api/address", {
        address: homeAddress,
        isWorkAddress: false,
        csrfToken,
      })
      .then((response) => {
        // We got a response back so use the updated address response.
        const home: AddressResponse = response.data;
        updatedHomeAddress = home.address;
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
        // address that the user submitted which we already saved in
        // `homeAddress`.
        updatedHomeAddress = homeAddress;
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
        setIsLoading(false);
        // Check to see if the submitted address is in NYC.
        const addressInNYC =
          nyCities.includes(updatedHomeAddress.city?.toLowerCase()) ||
          nyCounties.includes(updatedHomeAddress.county?.toLowerCase());
        // If we don't have a 403 error and need to start over, then do the
        // following check:
        // If the user is not in "nyc", then we ask the user for their
        // work address information. If the user is in "nys" and the home
        // address is not in "nyc", then we ask for their work address.
        // Otherwise, the home address is enough and we can go to the next step.
        if (nextUrl !== "/new") {
          if (
            formValues.location !== "nyc" ||
            ((formValues.location === "nyc" || formValues.location === "nys") &&
              !addressInNYC)
          ) {
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
    <>
      <Heading level="three">Home Address</Heading>
      <p>If you live in NYC, please fill out the home address form.</p>

      <Loader isLoading={isLoading} />

      <Form
        action="/library-card/api/submit"
        id="address-container"
        method="post"
        onSubmit={handleSubmit(submitForm)}
      >
        <AddressFormFields id="address-container" type={AddressTypes.Home} />

        <FormRow display="none">
          <DSFormField>
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
          </DSFormField>
        </FormRow>

        <FormRow>
          <DSFormField>
            <RoutingLinks
              previous={{ url: "/personal?newCard=true" }}
              next={{ submit: true }}
            />
          </DSFormField>
        </FormRow>
      </Form>
    </>
  );
};

export default AddressContainer;
