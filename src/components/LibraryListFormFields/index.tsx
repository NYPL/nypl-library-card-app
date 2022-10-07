import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import Autosuggest from "react-autosuggest";

import FormField from "../FormField";
import useFormDataContext from "../../context/FormDataContext";
import { findLibraryName } from "../../utils/formDataUtils";
import { LibraryListObject } from "../../interfaces";
import styles from "./LibraryListFormFields.module.css";
import { useRouter } from "next/router";

interface LibraryListFormProps {
  libraryList: LibraryListObject[];
}

/**
 * LibraryListForm
 * Renders a complete label, input, and description text form field that
 * allows patrons to select their home library from the `libraryList` prop.
 * This component depends on the react-hook-form library to process updates on
 * the select element and for form values. Also uses `react-autosuggest` to
 * render suggestions when a patron starts to type a library name.
 */
const LibraryListForm = ({
  libraryList = [],
}: LibraryListFormProps): React.ReactElement => {
  const { t } = useTranslation("common");
  const {
    query: { lang = "en" },
  } = useRouter();
  const { state } = useFormDataContext();
  const { formValues } = state;
  const defaultValue = formValues?.homeLibraryCode
    ? findLibraryName(formValues?.homeLibraryCode, lang as string)
    : "";
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const { register } = useFormContext();

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };
  /**
   * getSuggestions
   * This function tells react-autosuggest how to filter the suggestions. In this
   * case, if the user input is found anywhere in any of the libraries' name,
   * return the library. This is to "search" even if the user doesn't start with
   * the library's first name.
   */
  const getSuggestions = (value: string, list: LibraryListObject[]) => {
    const inputValue = value.trim().toLowerCase();
    const findInString = (l) =>
      l.label.toLowerCase().indexOf(inputValue) !== -1;
    return inputValue.length === 0 ? [] : list.filter(findInString);
  };
  /**
   * getSuggestionValue
   * All we need is the label of the library object as the value.
   */
  const getSuggestionValue = (suggestion: LibraryListObject) =>
    suggestion.label;
  /**
   * renderSuggestion
   * How to display each suggestion which gets rendered in a list item element.
   */
  const renderSuggestion = (suggestion: LibraryListObject) => (
    <div>{suggestion.label}</div>
  );
  // Autosuggest will call this function every time suggestions need to be
  // updated.
  const onSuggestionsFetchRequested = ({ value }) =>
    setSuggestions(getSuggestions(value, libraryList));
  // Clear suggestions.
  const onSuggestionsClearRequested = () => setSuggestions([]);
  // Autosuggest will pass through all these props to the input.

  const inputProps = {
    placeholder: `${t("account.library.placeholder")}`,
    value,
    onChange,
    // Pass in the `react-hook-form` register function so it can handle this
    // form element's state for us.
    ref: register(),
  };
  /**
   * renderInputComponent
   * This is the custom component we want to render for the form field.
   */
  const renderInputComponent = (inputProps) => {
    // According to axe, this is a bad aria label,
    // so let's remove it.
    delete inputProps["aria-autocomplete"];

    return (
      <FormField
        id="librarylist-autosuggest"
        label={t("account.library.selectLibrary")}
        name="homeLibraryCode"
        isRequired={false}
        attributes={{ ...inputProps }}
      />
    );
  };
  /**
   * renderSuggestionsContainer
   * To solve an accessibility issue, we render the autosuggest container
   * with an `aria-label`.
   */
  const renderSuggestionsContainer = ({ containerProps, children }) => (
    <div {...containerProps} aria-label="List of library name suggestions.">
      {children}
    </div>
  );

  return (
    <div className={styles.container}>
      <Heading level="three">{t("account.library.title")}</Heading>
      <p>{t("account.library.description.part1")}</p>
      <p>{t("account.library.description.part2")}</p>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
      />
    </div>
  );
};

export default LibraryListForm;
