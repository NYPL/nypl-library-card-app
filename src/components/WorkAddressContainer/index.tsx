import {
  Form,
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";
import isEmpty from "lodash/isEmpty";

import AddressFormFields from "../AddressFormFields";
import RoutingLinks from "../RoutingLinks.tsx";
import {
  AddressResponse,
  AddressesResponse,
  AddressTypes,
} from "../../interfaces";
import FormField from "../FormField";
import LoadingIndicator from "../LoadingIndicator";

import { constructAddressType } from "../../utils/formDataUtils";
import useFormDataContext from "../../context/FormDataContext";
import { createQueryParams } from "../../utils/utils";
import { useTranslation } from "next-i18next";
import { commonAPIErrors } from "../../data/apiErrorMessageTranslations";
import { Paragraph } from "../Paragraph";
import { PageSubHeading } from "../PageSubHeading";
import stateData from "../../data/stateAbbreviations";

const AddressContainer = ({ csrfToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useFormDataContext();
  const { formValues, addressesResponse } = state;
  const router = useRouter();
  const { t } = useTranslation("common");
  const { handleSubmit, watch, trigger } = useFormContext();
  const queryStr = createQueryParams(router?.query);

  const [line1, city, stateValue, zip] = watch([
    "work-line1",
    "work-city",
    "work-state",
    "work-zip",
  ]);
  const formIsPartiallyFilled = !![line1, city, stateValue, zip].some(
    (val) => val && val.trim() !== ""
  );

  useEffect(() => {
    if (!formIsPartiallyFilled) {
      // Re-validate the form fields to clear any validation errors
      // if the user has cleared out all the fields after partially filling out the form.
      trigger(["work-line1", "work-city", "work-state", "work-zip"]);
    }
  }, [formIsPartiallyFilled, trigger]);

  /**
   * submitForm
   * @param formData - data object returned from react-hook-form
   */
  const submitForm = async (formData, e) => {
    e.preventDefault();
    setIsLoading(true);
    const workAddress = constructAddressType(formData, "work");
    // If the work address wasn't filled out, that's okay, proceed.
    if (
      !workAddress.line1 &&
      !workAddress.city &&
      !workAddress.state &&
      !workAddress.zip
    ) {
      await router.push(`/address-verification?${queryStr}`);
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
              value: commonAPIErrors.errorValidatingToken,
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
              (async () => {
                dispatch({ type: "SET_FORM_ERRORS", value: null });
                await router.push(nextUrl);
              })();
            }, 2500);
          } else {
            (async () => {
              setIsLoading(false);
              nextUrl = `/address-verification?${queryStr}`;

              await router.push(nextUrl);
            })();
          }
        });
    }
  };

  return (
    <>
      <LoadingIndicator isLoading={isLoading} />

      <PageSubHeading>{t("location.workAddress.title")}</PageSubHeading>
      <Paragraph>{t("location.workAddress.description.part2")}</Paragraph>

      <Form
        // action="/library-card/api/submit"
        id="work-address-container"
        method="post"
        onSubmit={handleSubmit(submitForm)}
      >
        <AddressFormFields
          id="work-address-container"
          type={AddressTypes.Work}
          isRequired={formIsPartiallyFilled}
          stateData={stateData}
        />

        <FormRow display="none">
          <DSFormField>
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
          </DSFormField>
        </FormRow>

        <FormRow>
          <DSFormField>
            <RoutingLinks
              isDisabled={isLoading}
              previous={{ url: `/location?${queryStr}` }}
              next={{ submit: true }}
            />
          </DSFormField>
        </FormRow>
      </Form>
    </>
  );
};

export default AddressContainer;
