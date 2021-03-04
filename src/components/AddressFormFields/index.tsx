import React from "react";
import FormField from "../FormField";
import { Address, AddressTypes } from "../../interfaces";
import { useFormContext } from "react-hook-form";
import { isNumeric } from "validator";
import useFormDataContext from "../../context/FormDataContext";

interface AddressFormProps {
  type: AddressTypes;
  errorMessages: Address;
}

/**
 * AddressForm
 * Builds out the form fields needed for an address object that includes the
 * street address (line1), second street address (line2), city, state,
 * and zip code.
 */
const AddressForm = ({ type, errorMessages }: AddressFormProps) => {
  const { state } = useFormDataContext();
  const { formValues } = state;
  // This component must be used within the `react-hook-form` provider so that
  // these functions are available to use.
  const { register, errors } = useFormContext();
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
      return !isRequired || value.length <= max || errorMessages[field];
    }
    return (
      !isRequired ||
      value.length === min ||
      value.length === max ||
      errorMessages[field]
    );
  };
  /**
   * lengthValidation
   * Make sure that the zip code is a numeric value, then check for its length.
   */
  const validateZip = () => (value) => {
    if (!isNumeric(value) && isRequired) {
      return errorMessages.zip;
    }
    return lengthValidation(MINLENGTHZIP, MAXLENGTHZIP, "zip")(value);
  };

  return (
    <fieldset>
      <legend>{type} address form fields</legend>
      <FormField
        id={`line1-${type}`}
        label="Street Address"
        name={`${type}-line1`}
        isRequired={isRequired}
        errorState={errors}
        ref={register({
          required: {
            value: isRequired,
            message: errorMessages.line1,
          },
        })}
        defaultValue={formValues[`${type}-line1`]}
      />
      <FormField
        id={`line2-${type}`}
        label="Apartment / Suite"
        name={`${type}-line2`}
        ref={register()}
        defaultValue={formValues[`${type}-line2`]}
      />
      <div className="input-group">
        <div style={{ flex: "1" }}>
          <FormField
            id={`city-${type}`}
            label="City"
            name={`${type}-city`}
            isRequired={isRequired}
            errorState={errors}
            ref={register({
              required: {
                value: isRequired,
                message: errorMessages.city,
              },
            })}
            defaultValue={formValues[`${type}-city`]}
          />
        </div>
        <div style={{ flex: "1" }}>
          <FormField
            id={`state-${type}`}
            instructionText="2-letter abbreviation"
            label="State"
            name={`${type}-state`}
            isRequired={isRequired}
            errorState={errors}
            maxLength={STATELENGTH}
            ref={register({
              validate: lengthValidation(STATELENGTH, STATELENGTH, "state"),
            })}
            defaultValue={formValues[`${type}-state`]}
          />
        </div>
      </div>
      <div className="input-group">
        <div style={{ flex: "1" }}>
          <FormField
            id={`zip-${type}`}
            label="Postal Code"
            name={`${type}-zip`}
            isRequired={isRequired}
            errorState={errors}
            minLength={MINLENGTHZIP}
            maxLength={MAXLENGTHZIP}
            instructionText="5 or 9-digit postal code"
            ref={register({
              validate: validateZip(),
            })}
            defaultValue={formValues[`${type}-zip`]}
          />
        </div>
        {/* Easier to align with an empty block. */}
        <div style={{ flex: "1" }}></div>
      </div>
    </fieldset>
  );
};

export default AddressForm;
