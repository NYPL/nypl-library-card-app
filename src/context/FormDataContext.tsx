import React, { useReducer, PropsWithChildren } from "react";
import { formReducer } from "../reducers";
import {
  FormDataContextType,
  FormData,
  FormInputData,
  AddressRenderType,
  AddressResponse,
} from "../interfaces";

// Default initial values.
export const formInitialState: FormData = {
  results: undefined,
  errorObj: null,
  csrfToken: null,
  formValues: {
    ecommunicationsPref: true,
    policyType: "webApplicant",
  } as FormInputData,
  addressResponse: {
    home: {} as AddressRenderType,
    work: {} as AddressRenderType,
  } as AddressResponse,
};

interface FormDataType {
  initState: FormData;
}

const FormDataContext = React.createContext<FormDataContextType | undefined>(
  undefined
);

export const FormDataContextProvider: React.FC<PropsWithChildren<
  FormDataType
>> = ({ initState, children }) => {
  // Keep track of the API results and errors from a form submission as global
  // data in the app. It is exposed to the pages through context. Use
  // the `dispatch` function to update the state properties.
  const [state, dispatch] = useReducer(formReducer, initState);
  return (
    <FormDataContext.Provider value={{ state, dispatch }}>
      {children}
    </FormDataContext.Provider>
  );
};

/**
 * useFormDataContext
 * Custom hook that uses `useContext` for the `FormDataContext` and makes
 * sure it's being used with the provider. Simply returns the passed in set
 * function and data.
 */
export default function useFormDataContext() {
  const { state, dispatch } = React.useContext<FormDataContextType>(
    FormDataContext
  );
  if (typeof dispatch === "undefined") {
    throw new Error(
      "useFormDataContext must be used within a FormDataContextProvider"
    );
  }

  return { state, dispatch };
}
