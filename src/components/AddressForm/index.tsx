import React from "react";
import FormField from "../FormField";
import { Address } from "../../interfaces";
import { useFormContext } from "react-hook-form";
import useFormDataContext from "../../context/FormDataContext";

export enum AddressTypes {
  Home = "home",
  Work = "work",
}

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
  const MAXLENGTHSTATE = 2;
  const MINLENGTHZIP = 5;
  const MAXLENGTHZIP = 10;
  // Only the home address is required. The work address is optional.
  const isRequired = type === AddressTypes.Home;
  /**
   * lengthValidation
   * Returns a function to use for the `validate` property in the `register`
   * function from `react-hook-form`. If the field is not required, the
   * check is bypassed so that the error message doesn't display. If the field
   * is required, the value must have the appropriate length or else the
   * error message will display.
   * @param length Max length of the field input.
   * @param field The key name of the field.
   */
  const lengthValidation = (max, field, min = undefined) => (value) => {
    if (!min) {
      return !isRequired || value.length === max || errorMessages[field];
    }
    return (
      !isRequired ||
      value.length === min ||
      value.length === max ||
      errorMessages[field]
    );
  };

  return (
    <>
      <FormField
        id={`patronLine1-${type}`}
        className="nypl-text-field"
        type="text"
        label="Street Address"
        fieldName={`${type}-line1`}
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
        id={`patronLine2-${type}`}
        className="nypl-text-field"
        type="text"
        label="Apartment / Suite"
        fieldName={`${type}-line2`}
        ref={register()}
        defaultValue={formValues[`${type}-line2`]}
      />
      <FormField
        id={`patronCity-${type}`}
        className="nypl-text-field"
        type="text"
        label="City"
        fieldName={`${type}-city`}
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
      <FormField
        id={`patronState-${type}`}
        className="nypl-text-field"
        type="text"
        instructionText="2-letter abbreviation"
        label="State"
        fieldName={`${type}-state`}
        isRequired={isRequired}
        errorState={errors}
        maxLength={MAXLENGTHSTATE}
        ref={register({
          validate: lengthValidation(MAXLENGTHSTATE, "state"),
        })}
        defaultValue={formValues[`${type}-state`]}
      />
      <FormField
        id={`patronZip-${type}`}
        className="nypl-text-field"
        type="text"
        label="Postal Code"
        fieldName={`${type}-zip`}
        isRequired={isRequired}
        errorState={errors}
        minLength={MAXLENGTHZIP}
        maxLength={MAXLENGTHZIP}
        ref={register({
          validate: lengthValidation(MAXLENGTHZIP, "zip", MINLENGTHZIP),
        })}
        defaultValue={formValues[`${type}-zip`]}
      />
    </>
  );
};

export default AddressForm;
