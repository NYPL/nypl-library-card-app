import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

import useFormDataContext from "../../context/FormDataContext";
import AddressForm from "../AddressForm";
import RoutingLinks from "../RoutingLinks.tsx";
import LocationForm from "../LocationForm";
import { errorMessages } from "../../utils/formDataUtils";
import { Accordion } from "@nypl/design-system-react-components";
import {
  AddressRenderType,
  AddressResponse,
  AddressTypes,
} from "../../interfaces";
import styles from "./LocationAddressContainer.module.css";
import { constructAddresses } from "../../utils/formDataUtils";
import Loader from "../Loader";
import { lcaEvents } from "../../externals/gaUtils";

interface LocationAddressContainerProps {
  scrollRef: React.RefObject<HTMLHeadingElement>;
}

const LocationAddressContainer = ({
  scrollRef,
}: LocationAddressContainerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  // Specific functions and object from react-hook-form.
  const { handleSubmit, register } = useFormContext();

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
        const value: AddressResponse = {
          home: {} as AddressRenderType,
          work: {} as AddressRenderType,
        };
        const home: AddressRenderType = error.response?.data?.home;
        const work: AddressRenderType = error.response?.data?.work;
        // If the API call failed because the service is down and there is no
        // returned address data from the response, then display the initial
        // address that the user submitted.
        const initialAddresses = constructAddresses(formData);

        if (error.response?.data?.home) {
          value.home = home;
        } else {
          value.home = {
            address: initialAddresses.home,
            addresses: [],
            detail: "",
          };
        }
        if (error.response?.data?.work) {
          value.work = work;
        } else {
          value.work = {
            address: initialAddresses.work,
            addresses: [],
            detail: "",
          };
        }
        dispatch({
          type: "SET_ADDRESSES_VALUE",
          value,
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

  /**
   * addressFields
   * Renders the field sections for the home address, work address, and the
   * home library. The two parameters are required to be explicit about what
   * fields will be rendered when the function is called.
   */
  const addressFields = (displayWork: boolean) => (
    <>
      <div className={styles.addressSection}>
        <h3>Home Address</h3>
        <p>If you live in NYC, please fill out the home address form.</p>
        <AddressForm
          type={AddressTypes.Home}
          errorMessages={errorMessages.address}
        />
      </div>

      {displayWork && (
        <div className={styles.addressSection}>
          <h3>Work Address</h3>
          <Accordion
            id="work-address-accordion"
            accordionLabel="If you work in NYC, please fill out the work address form."
          >
            <AddressForm
              type={AddressTypes.Work}
              errorMessages={errorMessages.address}
            />
          </Accordion>
        </div>
      )}
    </>
  );

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Loader isLoading={isLoading} />

      <LocationForm
        scrollRef={scrollRef}
        inputRadioList={[
          {
            value: "nyc",
            label: "New York City (All five boroughs)",
            ref: register(),
            addressFields: addressFields(true),
          },
          {
            value: "nys",
            label: "New York State (Outside NYC)",
            ref: register(),
            addressFields: addressFields(true),
          },
          {
            value: "us",
            label: "United States (Visiting NYC)",
            // For radio buttons or for grouped inputs, the validation ref config for
            // react-hook-form goes in the last input element.
            ref: register({
              required: errorMessages.location,
            }),
            addressFields: addressFields(false),
          },
        ]}
      />

      <RoutingLinks
        previous={{ url: "/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default LocationAddressContainer;
