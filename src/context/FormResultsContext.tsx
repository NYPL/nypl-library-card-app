import React from "react";
import { FormResultsContextType } from "../interfaces";

const FormResultsContext = React.createContext<
  FormResultsContextType | undefined
>(undefined);

export const FormResultsContextProvider: React.FC<{
  value: FormResultsContextType;
}> = ({ value, children }) => (
  <FormResultsContext.Provider value={value}>
    {children}
  </FormResultsContext.Provider>
);

/**
 * useFormResultsContext
 * Custom hook that uses `useContext` for the `FormResultsContext` and makes
 * sure it's being used with the provider. Simply returns the passed in set
 * function and data.
 */
export default function useFormResultsContext() {
  const { setFormResults, formResults } = React.useContext<
    FormResultsContextType
  >(FormResultsContext);
  if (typeof setFormResults === "undefined") {
    throw new Error(
      "useFormResultsContext must be used within a FormResultsContextProvider"
    );
  }

  return { setFormResults, formResults };
}
