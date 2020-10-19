import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Input,
  Label,
  InputTypes,
  HelperErrorText,
} from "@nypl/design-system-react-components";
import useIPLocationContext from "../../context/IPLocationContext";
import { getLocationValueFromResponse } from "../../utils/IPLocationAPI";
import { lcaEvents } from "../../externals/gaUtils";

interface LocationFormProps {
  scrollRef?: React.RefObject<HTMLHeadingElement>;
  inputRadioList: LocationRadioInput[];
}

interface LocationRadioInput {
  value: string;
  label: string;
  ref: (ref: HTMLInputElement) => void;
  addressFields: any;
}

/**
 * LocationForm
 * Renders a radio button form to select a user location.
 */
const LocationForm = ({ inputRadioList, scrollRef }: LocationFormProps) => {
  if (!inputRadioList?.length) {
    return null;
  }

  // Get the user's location from the geolocation API based on their IP address.
  const userLocationResponse = useIPLocationContext();
  // Convert the response to the default value that should be selected in the
  // UI. If the geolocation API failed, no option will be selected by default.
  // Even though this location value is pre-selected, users should still be
  // able to update their location in the UI.
  const defaultUserLocation = getLocationValueFromResponse(
    userLocationResponse
  );
  const [stateValue, setStateValue] = useState(defaultUserLocation);
  const { errors } = useFormContext();
  const fieldName = "location";
  const legendId = `radio-legend-${fieldName}`;
  const errorText = errors?.location?.message;

  const onChange = (e) => {
    const location = e.target?.value;
    // For GA, if the geolocation was found, we want to track if the user
    // selected another location from the preselected location. Otherwise,
    // geolocation failed and the user will pick a location (or switch) and
    // we track each change.
    const eventText = defaultUserLocation
      ? `From preselected location ${defaultUserLocation} to ${location}`
      : `Selected ${location}`;

    // We want to scroll to the page heading so the page doesn't jump around
    // too much when rendering a new set of address fields when a radio input
    // option is selected.
    if (scrollRef?.current) {
      window.scrollTo(0, scrollRef.current.offsetTop);
    }
    lcaEvents("Location selection", eventText);
    setStateValue(location);
  };
  /**
   * createInputSection
   * From a `LocationRadioInput` object, this function will return a section of
   * a location option along with its relevant address fields to render. This
   * function will always render a radio input element but will only render its
   * address fields if it is checked.
   */
  const createInputSection = ({ value, label, ref, addressFields }) => {
    const checked = value === stateValue;
    const labelId = `radio-${fieldName}-${value}`;
    const inputId = `${fieldName}-${value}`;
    return (
      <div key={value}>
        <div className="radio-field">
          <Input
            className="radio-input"
            aria-labelledby={`${legendId} ${labelId}`}
            id={inputId}
            type={InputTypes.radio}
            attributes={{
              name: fieldName,
              "aria-checked": checked,
              checked: checked,
              onChange,
            }}
            value={value}
            ref={ref}
          />
          <Label id={labelId} htmlFor={`input-${inputId}`}>
            {label}
          </Label>
        </div>

        {checked && addressFields}
      </div>
    );
  };
  const createRadioForm = (inputList: LocationRadioInput[]) =>
    inputList.map((input) => createInputSection(input));

  return (
    <>
      {errorText && (
        <HelperErrorText isError={errorText}>{errorText}</HelperErrorText>
      )}
      <fieldset>
        <legend id={legendId}>I live, work, or go to school:</legend>
        {createRadioForm(inputRadioList)}
      </fieldset>
    </>
  );
};

export default LocationForm;
