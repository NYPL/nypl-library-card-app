import {
  FormField as DSFormField,
  FormRow,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React from "react";
import { useFormContext } from "react-hook-form";
import { isNumeric } from "validator";

import FormField from "../FormField";
import { AddressTypes, FormInputData } from "../../interfaces";
import useFormDataContext from "../../context/FormDataContext";

interface AddressFormProps {
  id?: string;
  type: AddressTypes;
}

/**
 * AddressForm
 * Builds out the form fields needed for an address object that includes the
 * street address (line1), second street address (line2), city, state,
 * and zip code.
 */
const AddressForm = ({ id, type }: AddressFormProps) => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  // This component must be used within the `react-hook-form` provider so that
  // these functions are available to use.
  const {
    register,
    formState: { errors },
  } = useFormContext<FormInputData>();
  const STATELENGTH = 2;
  const MINLENGTHZIP = 5;
  const MAXLENGTHZIP = 9;
  // Only the home address is required. The work address is optional.
  const isRequired = type === AddressTypes.Home;
  /**
   * lengthValidation
   * Returns a function to use for the `validate` property in the `register`
   * function from `react-hook-form`. If the field is not required, the
   * check is bypassed so that the error message doesn't display. If the field
   * is required, the value must have the appropriate length or else the
   * error message will display.
   */
  const lengthValidation = (min, max, field) => (value) => {
    if (!min) {
      return !isRequired || value.length <= max || t(field);
    }
    return (
      !isRequired || value.length === min || value.length === max || t(field)
    );
  };
  /**
   * lengthValidation
   * Make sure that the zip code is a numeric value, then check for its length.
   */
  const validateZip = () => (value) => {
    if (!isNumeric(value) && isRequired) {
      return t("location.errorMessage.zip");
    }
    return lengthValidation(
      MINLENGTHZIP,
      MAXLENGTHZIP,
      "location.errorMessage.zip"
    )(value);
  };

  return (
    <>
      <FormRow id={`${id}-addressForm-1`}>
        <DSFormField>
          <FormField
            id={`line1-${type}`}
            label={t("location.address.line1.label")}
            {...register(`${type}-line1`, {
              required: {
                value: isRequired,
                message: t("location.errorMessage.line1"),
              },
            })}
            isRequired={isRequired}
            errorState={errors}
            defaultValue={formValues[`${type}-line1`]}
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-addressForm-2`}>
        <DSFormField>
          <FormField
            id={`line2-${type}`}
            label={t("location.address.line2.label")}
            {...register(`${type}-line2`)}
            defaultValue={formValues[`${type}-line2`]}
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-addressForm-3`}>
        <DSFormField>
          <FormField
            id={`city-${type}`}
            label={t("location.address.city.label")}
            {...register(`${type}-city`, {
              required: {
                value: isRequired,
                message: t("location.errorMessage.city"),
              },
            })}
            isRequired={isRequired}
            errorState={errors}
            defaultValue={formValues[`${type}-city`]}
          />
        </DSFormField>
        <DSFormField>
          <FormField
            id={`state-${type}`}
            instructionText={t("location.address.state.instruction")}
            label={t("location.address.state.label")}
            {...register(`${type}-state`, {
              validate: lengthValidation(
                STATELENGTH,
                STATELENGTH,
                "location.errorMessage.state"
              ),
            })}
            isRequired={isRequired}
            errorState={errors}
            maxLength={STATELENGTH}
            defaultValue={formValues[`${type}-state`]}
          />
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-addressForm-4`}>
        <DSFormField>
          <FormField
            id={`zip-${type}`}
            label={t("location.address.postalCode.label")}
            {...register(`${type}-zip`, {
              validate: validateZip(),
            })}
            isRequired={isRequired}
            errorState={errors}
            minLength={MINLENGTHZIP}
            maxLength={MAXLENGTHZIP}
            instructionText={t("location.address.postalCode.instruction")}
            defaultValue={formValues[`${type}-zip`]}
          />
        </DSFormField>
        <DSFormField></DSFormField>
      </FormRow>
    </>
  );
};

export default AddressForm;
