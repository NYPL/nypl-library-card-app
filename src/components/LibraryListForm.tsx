import React, { useState } from "react";
import {
  Label,
  Select,
  HelperErrorText,
} from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";
import Autosuggest from "react-autosuggest";
import FormField from "./FormField";

export interface LibraryListObject {
  value: string;
  label: string;
}

interface LibraryListFormProps {
  libraryList: LibraryListObject[];
  defaultValue: string;
}

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value, list) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : list.filter(
        (l) => l.label.toLowerCase().slice(0, inputLength) === inputValue
      );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => {
  return suggestion.label;
};

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => {
  return <div>{suggestion.label}</div>;
};

/**
 * LibraryListForm
 * Renders a complete label, select, and description text form field that
 * allows patrons to select their home library from the `libraryList` prop.
 * This component depends on the react-hook-form library to process updates on
 * the select element and for form values.
 */
const LibraryListForm = ({
  libraryList = [],
  defaultValue,
}: LibraryListFormProps) => {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);

  const { register } = useFormContext();

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };
  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, libraryList));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type a library name",
    value,
    onChange,
    ref: register(),
  };

  const renderInputComponent = (inputProps) => {
    return (
      <FormField
        other={inputProps}
        id="librarylist-suggest-test"
        type="text"
        label="Home Library:"
        fieldName="libraryListSuggest"
        isRequired
        instructionText="Select your home library from the list."
      />
    );
  };

  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
      />
      {/* <Label htmlFor="homeLibrarySelect" id="homeLibrarylabel">
        Home Library:
      </Label>
      <Select
        isRequired={false}
        helperTextId="homeLibraryHelperText"
        id="homeLibrarySelect"
        labelId="homeLibrarylabel"
        name="homeLibraryCode"
        selectedOption={defaultValue}
        ref={register()}
      >
        {libraryList.map((library) => (
          <option key={library.value} value={library.value}>
            {library.label}
          </option>
        ))}
      </Select>
      <HelperErrorText id="homeLibraryHelperText" isError={false}>
        Select your home library from the list.
      </HelperErrorText> */}
    </>
  );
};

export default LibraryListForm;
