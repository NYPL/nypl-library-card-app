import React from "react";
import {
  Label,
  Select,
  HelperErrorText,
} from "@nypl/design-system-react-components";
import { useFormContext } from "react-hook-form";

export interface LibraryListObject {
  value: string;
  label: string;
}

interface LibraryListFormProps {
  libraryList: LibraryListObject[];
  defaultValue: string;
}

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
  const { register } = useFormContext();
  return (
    <>
      <Label htmlFor="homeLibrarySelect" id="homeLibrarylabel">
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
      </HelperErrorText>
    </>
  );
};

export default LibraryListForm;
