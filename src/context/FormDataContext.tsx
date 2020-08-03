import React from "react";
import { FormDataContextType } from "../interfaces";

const FormDataContext = React.createContext<FormDataContextType | undefined>(
  undefined
);

export const FormDataContextProvider: React.FC<{
  value: FormDataContextType;
}> = ({ value, children }) => (
  <FormDataContext.Provider value={value}>{children}</FormDataContext.Provider>
);

/**
 * useFormDataContext
 * Custom hook that uses `useContext` for the `FormDataContext` and makes
 * sure it's being used with the provider. Simply returns the passed in set
 * function and data.
 */
export default function useFormDataContext() {
  const { dispatch, state } = React.useContext<FormDataContextType>(
    FormDataContext
  );
  if (typeof dispatch === "undefined") {
    throw new Error(
      "useFormDataContext must be used within a FormDataContextProvider"
    );
  }

  return { dispatch, state };
}
