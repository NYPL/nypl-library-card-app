import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Input,
  Label,
  InputTypes,
  HelperErrorText,
} from "@nypl/design-system-react-components";

interface LocationFormProps {
  errorMessage: string;
  // Currently not used but will be set in the future and that
  // value will be the default.
  ipLocation?: string;
}

interface LocationInput {
  value: string;
  label: string;
  ref: (ref: HTMLInputElement) => void;
}

/**
 * LocationForm
 * Renders a radio button form to select a user location.
 */
const LocationForm = ({ errorMessage, ipLocation = "" }: LocationFormProps) => {
  const [stateValue, setStateValue] = useState(ipLocation);
  const { register, errors } = useFormContext();
  const fieldName = "location";
  const legendId = `radio-legend-${fieldName}`;
  const errorText = errors?.location?.message;

  const onChange = (e) => setStateValue(e.target?.value);
  const locationInputs: LocationInput[] = [
    {
      value: "nyc",
      label: "New York City (All five boroughs)",
      ref: register(),
    },
    {
      value: "nys",
      label: "New York State (Outside NYC)",
      ref: register(),
    },
    {
      value: "us",
      label: "United States (Visiting NYC)",
      // For radio buttons or for grouped inputs, the validation ref config for
      // react-hook-form goes in the last input element.
      ref: register({
        required: errorMessage,
      }),
    },
  ];
  const createInput = (value, label, ref) => {
    const checked = value === stateValue;
    const labelId = `radio-${fieldName}-${value}`;
    const inputId = `${fieldName}-${value}`;
    return (
      <div key={value} className="radio-field">
        <Input
          className="radio-input"
          aria-labelledby={`${legendId} ${labelId}`}
          id={inputId}
          type={InputTypes.radio}
          attributes={{
            name: fieldName,
            "aria-checked": checked,
            defaultChecked: checked,
            onChange,
          }}
          value={value}
          ref={ref}
        />
        <Label id={labelId} htmlFor={`input-${inputId}`}>
          {label}
        </Label>
      </div>
    );
  };
  const createRadioForm = (inputList: LocationInput[]) =>
    inputList.map((input) => createInput(input.value, input.label, input.ref));

  return (
    <>
      <p className="nypl-address-note">
        If your address is outside the United States, please use our{" "}
        <a href="https://catalog.nypl.org/selfreg/patonsite">alternate form</a>.
      </p>
      {errorText && (
        <HelperErrorText isError={errorText}>{errorText}</HelperErrorText>
      )}
      <fieldset>
        <legend id={legendId}>
          I live, work, go to school, or pay property taxes at an address in:
          <span className="required-field"> Required</span>
        </legend>
        {createRadioForm(locationInputs)}
      </fieldset>
    </>
  );
};

export default LocationForm;
