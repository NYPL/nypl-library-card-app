import {
  FormField as DSFormField,
  FormRow,
  Select,
} from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { isNumeric } from "validator";

import FormField from "../FormField";
import { findState } from "../../utils/formDataUtils";
import { AddressTypes, FormInputData } from "../../interfaces";
import useFormDataContext from "../../context/FormDataContext";
import { USStateObject } from "../../interfaces";

interface AddressFormProps {
  id?: string;
  type: AddressTypes;
  /* Only the home page is required by default. */
  isRequired: boolean;
  stateData: USStateObject[];
}

/**
 * AddressForm
 * Builds out the form fields needed for an address object that includes the
 * street address (line1), second street address (line2), city, state,
 * and zip code.
 */
const AddressForm = ({
  id,
  type,
  isRequired,
  stateData = [],
}: AddressFormProps) => {
  const { t } = useTranslation("common");
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<FormInputData>();
  const { state } = useFormDataContext();
  const { formValues } = state;
  const defaultStateValue = formValues[`${type}-state`]
    ? findState(formValues[`${type}-state`])
    : "";
  const [stateValue, setStateValue] = useState(defaultStateValue);

  const onChange = useCallback(
    (event) => {
      // Set value manually to trigger the watch() function
      setValue(`${type}-state`, event.target.value, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setStateValue(event.target.value);
    },
    [isRequired]
  );

  const inputProps = {
    value: stateValue,
    onChange,
  };

  const styles = {
    gridSpacing: {
      mb: { base: "-l", md: "0" },
    },
  };

  const MIN_LENGTH_ZIP = 5;
  const MAX_LENGTH_ZIP = 9;

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
      MIN_LENGTH_ZIP,
      MAX_LENGTH_ZIP,
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
            autoComplete={`section-${type} address-line1`}
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
            autoComplete={`section-${type} address-line2`}
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
            autoComplete={`section-${type} address-level2`}
          />
        </DSFormField>
        <DSFormField>
          <Select
            placeholder="Please select"
            id={`state-${type}`}
            labelText={t("location.address.state.label")}
            autoComplete={`section-${type} address-level1`}
            isRequired={isRequired}
            isInvalid={!!errors?.[`${type}-state`]?.message}
            defaultValue={formValues[`${type}-state`]}
            invalidText={t("location.errorMessage.state")}
            // Pass in the `react-hook-form` register function so it can handle this
            // form element's state for us.
            {...register(`${type}-state`, {
              required: {
                value: isRequired,
                message: t("location.errorMessage.state"),
              },
            })}
            {...inputProps}
          >
            {stateData.map(({ label }, i) => (
              <option key={`${i}-${label}`}>{label}</option>
            ))}
          </Select>
        </DSFormField>
      </FormRow>

      <FormRow id={`${id}-addressForm-4`}>
        <DSFormField sx={styles.gridSpacing}>
          <FormField
            id={`zip-${type}`}
            label={t("location.address.postalCode.label")}
            {...register(`${type}-zip`, {
              validate: validateZip(),
            })}
            isRequired={isRequired}
            errorState={errors}
            minLength={MIN_LENGTH_ZIP}
            maxLength={MAX_LENGTH_ZIP}
            instructionText={t("location.address.postalCode.instruction")}
            defaultValue={formValues[`${type}-zip`]}
            autoComplete={`section-${type} postal-code`}
            pattern="[0-9]*"
            inputMode="numeric"
          />
        </DSFormField>
        <DSFormField></DSFormField>
      </FormRow>
    </>
  );
};

export default AddressForm;
