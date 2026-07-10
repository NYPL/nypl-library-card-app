import {
  Form,
  FormField as DSFormField,
  FormRow,
  Link as DSLink,
} from "@nypl/design-system-react-components";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import AddressFormFields from "../AddressFormFields";
import stateData from "../../data/stateAbbreviations";
import RoutingLinks from "../RoutingLinks.tsx";
import {
  AddressResponse,
  AddressesResponse,
  AddressTypes,
} from "../../interfaces";
import LoadingIndicator from "../LoadingIndicator";
import { constructAddressType, getAge } from "../../utils/formDataUtils";

import { nyCounties, nyCities, createQueryParams } from "../../utils/utils";
import useFormDataContext from "../../context/FormDataContext";
import { normalizeAxiosError } from "../../utils/apiErrorUtils";
import { ErrorCodes } from "../../errors";
import { NRError } from "../../logger/newrelic";
import { PageSubHeading } from "../PageSubHeading";
import { Paragraph } from "../Paragraph";

const AddressContainer = ({ csrfToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  const router = useRouter();
  const { t } = useTranslation("common");
  // Specific functions and object from react-hook-form.
  const { handleSubmit } = useFormContext();
  // Get the URL query params for `newCard` and `lang`.
  const queryStr = createQueryParams(router?.query);

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = async (formData, e) => {
    e.preventDefault();
    setIsLoading(true);

    // Set the global form state...
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, ...formData },
    });

    // This is the home address from the form fields.
    const homeAddress = constructAddressType(formData, "home");
    let updatedHomeAddress = homeAddress;

    try {
      const response = await axios.post("/library-card/api/address", {
        address: homeAddress,
        isWorkAddress: false,
        csrfToken,
      });
      const home: AddressResponse = response.data;
      updatedHomeAddress = home.address;
      dispatch({
        type: "SET_ADDRESSES_VALUE",
        value: { home } as AddressesResponse,
      });
    } catch (error) {
      const apiError = normalizeAxiosError(error);
      if (apiError.type === ErrorCodes.CSRF_INVALID) {
        dispatch({ type: "SET_FORM_ERRORS", value: apiError });
        setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2500));
        dispatch({ type: "SET_FORM_ERRORS", value: null });
        await router.push("/new");
        return;
      }

      let home = error.response?.data;
      if (isEmpty(home)) {
        home = { address: homeAddress, addresses: [], detail: "" };
      }

      NRError(new Error(`Error Validating Address. ${JSON.stringify(error)}`), {
        customAttributes: {
          contactForm: `Error Validating Address. ${JSON.stringify(error)}`,
        },
      });
      dispatch({ type: "SET_ADDRESSES_VALUE", value: { home } });
    }

    setIsLoading(false);

    const age = getAge(formValues.birthdate);
    const inNY = updatedHomeAddress.state === "NY";

    // age>=18 and outside NY
    if (age >= 18 && !inNY) {
      await router.push(`/identity-verification?${queryStr}`);
      return;
    }

    // age >=18 and in NY
    if (age >= 18 && inNY) {
      //NOTE: We will render the result of this API call on the page
      const dbCheckResponse = axios
        .post("/library-card/api/identity-verification/db-check", {
          // NOTE: We will need to find out what parameters are needed when we implement the API call to the vendor for the database check.
        })
        .catch(() => {
          // We may want to render the errors here?
        });
      console.log(dbCheckResponse);
      await router.push(`/address-verification?${queryStr}`);
      return;
    }

    const addressInNYC =
      nyCities.includes(updatedHomeAddress.city?.toLowerCase()) ||
      nyCounties.includes(updatedHomeAddress.county?.toLowerCase());

    const nextUrl =
      formValues.location !== "nyc" ||
      ((formValues.location === "nyc" || formValues.location === "nys") &&
        !addressInNYC)
        ? `/alternate-address?${queryStr}`
        : `/address-verification?${queryStr}`;

    await router.push(nextUrl);
  };

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />

      <PageSubHeading mb="xs">{t("location.address.title")}</PageSubHeading>
      <Paragraph m={0} mb="l">
        <Trans
          i18nKey="location.address.description"
          components={{ a: <DSLink variant="external" /> }}
          values={{
            alternateForm: t("location.address.alternateForm"),
          }}
        />
      </Paragraph>
      <Form
        mt="l"
        id="address-container"
        onSubmit={handleSubmit(submitForm)}
        noValidate
      >
        <AddressFormFields
          id="address-container"
          type={AddressTypes.Home}
          isRequired
          stateData={stateData}
        />

        <FormRow>
          <DSFormField>
            <RoutingLinks
              isDisabled={isLoading}
              previous={{ url: `/personal?${queryStr}` }}
              next={{ submit: true }}
            />
          </DSFormField>
        </FormRow>
      </Form>
    </>
  );
};

export default AddressContainer;
