import React, { useState } from "react";
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

/**
 * getSuggestions
 * This function tells react-autosuggest how to filter the suggestions. In this
 * case, if the user input is found anywhere in any of the libraries' name,
 * return the library. This is to "search" even if the user doesn't start with
 * the library's first name.
 */
const getSuggestions = (value: string, list: LibraryListObject[]) => {
  const inputValue = value.trim().toLowerCase();
  const findInString = (l) => l.label.toLowerCase().indexOf(inputValue) !== -1;
  return inputValue.length === 0 ? [] : list.filter(findInString);
};
/**
 * getSuggestionValue
 * All we need is the label of the library object as the value.
 */
const getSuggestionValue = (suggestion: LibraryListObject) => suggestion.label;
/**
 * renderSuggestion
 * How to display each suggestion which gets rendered in a list item element.
 */
const renderSuggestion = (suggestion: LibraryListObject) => (
  <div>{suggestion.label}</div>
);

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
  const onSuggestionsFetchRequested = ({ value }) =>
    setSuggestions(getSuggestions(value, libraryList));

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => setSuggestions([]);
  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type a library name, e.g. Stavros Niarchos",
    value,
    onChange,
    // Pass in the `react-hook-form` register function so it can handle this
    // form element's state for us.
    ref: register(),
  };

  const renderInputComponent = (inputProps) => (
    <FormField
      id="librarylist-autosuggest"
      type="text"
      label="Home Library:"
      fieldName="homeLibraryCode"
      isRequired={false}
      instructionText="Select your home library from the list. Start by typing the name of the library."
      {...inputProps}
    />
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      renderInputComponent={renderInputComponent}
    />
  );
};

export default LibraryListForm;
