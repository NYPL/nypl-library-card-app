import { Heading, Select } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import useFormDataContext from "../../context/FormDataContext";
import { findLibraryName } from "../../utils/formDataUtils";
import { LibraryListObject } from "../../interfaces";
import styles from "./LibraryListFormFields.module.css";

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
const LibraryListForm = ({ libraryList = [] }: LibraryListFormProps) => {
  const { t } = useTranslation("common");
  const { state } = useFormDataContext();
  const { formValues } = state;
  const defaultValue = formValues?.homeLibraryCode
    ? findLibraryName(formValues?.homeLibraryCode)
    : "";
  const [value, setValue] = useState(defaultValue);
  const { register } = useFormContext();

  const onChange = (event) => {
    setValue(event.target.value);
  };
  const inputProps = {
    value,
    onChange,
    // Pass in the `react-hook-form` register function so it can handle this
    // form element's state for us.
    ref: register(),
  };

  return (
    <div className={styles.container}>
      <Heading level="three">{t("account.library.title")}</Heading>
      <p>{t("account.library.description.part1")}</p>
      <p>{t("account.library.description.part2")}</p>
      <Select
        id="librarylist-select"
        labelText={t("account.library.selectLibrary")}
        name="homeLibraryCode"
        isRequired={false}
        {...inputProps}
      >
        {libraryList.map(({ value, label }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default LibraryListForm;
