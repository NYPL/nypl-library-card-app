import React from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

import useFormDataContext from "../../context/FormDataContext";
import AddressForm from "../AddressForm";
import RoutingLinks from "../RoutingLinks.tsx";
import LibraryListForm from "../LibraryListForm";
import LocationForm from "../LocationForm";
import ilsLibraryList from "../../data/ilsLibraryList";
import { errorMessages, findLibraryCode } from "../../utils/formDataUtils";
import { Accordion } from "@nypl/design-system-react-components";
import {
  AddressRenderType,
  AddressResponse,
  AddressTypes,
} from "../../interfaces";
import styles from "./LocationAddressContainer.module.css";
import { constructAddresses } from "../../utils/formDataUtils";

interface LocationAddressContainerProps {
  scrollRef: React.RefObject<HTMLHeadingElement>;
}

const LocationAddressContainer = ({
  scrollRef,
}: LocationAddressContainerProps) => {
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
    // Convert the home library name to its code value.
    formData.homeLibraryCode = findLibraryCode(formData.homeLibraryCode);
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
      .finally(() =>
        router.push("/library-card/address-verification?newCard=true")
      );
  };

  /**
   * addressFields
   * Renders the field sections for the home address, work address, and the
   * home library. The two parameters are required to be explicit about what
   * fields will be rendered when the function is called.
   */
  const addressFields = ({
    work,
    homeLibrary,
  }: {
    work: boolean;
    homeLibrary: boolean;
  }) => (
    <>
      <div className={styles.addressSection}>
        <h3>Home Address</h3>
        <Accordion
          id="home-address-accordion"
          accordionLabel="If you live in NYC, please fill out the home address form."
        >
          <AddressForm
            type={AddressTypes.Home}
            errorMessages={errorMessages.address}
          />
        </Accordion>
      </div>

      {work && (
        <div className={styles.addressSection}>
          <h3>Work Address</h3>
          <Accordion
            id="work-address-accordion"
            accordionLabel="If you live in NYC, please fill out the work address form."
          >
            <AddressForm
              type={AddressTypes.Work}
              errorMessages={errorMessages.address}
            />
          </Accordion>
        </div>
      )}

      {homeLibrary && <LibraryListForm libraryList={ilsLibraryList} />}
    </>
  );

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <LocationForm
        scrollRef={scrollRef}
        inputRadioList={[
          {
            value: "nyc",
            label: "New York City (All five boroughs)",
            ref: register(),
            addressFields: addressFields({ work: true, homeLibrary: true }),
          },
          {
            value: "nys",
            label: "New York State (Outside NYC)",
            ref: register(),
            addressFields: addressFields({ work: true, homeLibrary: false }),
          },
          {
            value: "us",
            label: "United States (Visiting NYC)",
            // For radio buttons or for grouped inputs, the validation ref config for
            // react-hook-form goes in the last input element.
            ref: register({
              required: errorMessages.location,
            }),
            addressFields: addressFields({ work: false, homeLibrary: false }),
          },
        ]}
      />

      <RoutingLinks
        previous={{ url: "/library-card/personal?newCard=true" }}
        next={{ submit: true }}
      />
    </form>
  );
};

export default LocationAddressContainer;
