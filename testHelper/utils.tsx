import React from "react";
import { useForm, FormProvider } from "react-hook-form";

import {
  FormDataContextProvider,
  formInitialState,
} from "../src/context/FormDataContext";
import { FormData, LocationResponse } from "../src/interfaces";

interface MockMethods {
  children: React.ReactNode;
  errors?: any;
  // The types coming from `react-hook-form` for its functions.
  getValues?: () => { [x: string]: any };
  watch?: () => { [x: string]: any };
}

interface TestProviderType {
  children: React.ReactNode;
  formDataState?: FormData;
  hookFormState?: MockMethods;
  userLocation?: LocationResponse;
}

/**
 * TestHookFormProvider
 * Simple wrapper component to expose `react-hook-form`'s context to use
 * for testing the AddressForm. There are optional props which can override
 * existing `react-hook-form` functions to trigger and return test values.
 */
export const TestHookFormProvider: React.FC<MockMethods> = ({
  children,
  errors,
  getValues,
  watch,
}) => {
  const formMethods = useForm();
  // `errors` is an object so it's okay to combine like this since it can
  // be empty.
  const updatedMethods = { ...formMethods, errors };
  // But any function that we want to override needs to be updated like this:
  if (getValues) {
    updatedMethods.getValues = getValues;
  }
  if (watch) {
    updatedMethods.watch = watch;
  }
  return <FormProvider {...updatedMethods}>{children}</FormProvider>;
};

/**
 * TestProviderWrapper
 * Wrapper component that wraps the child component with the
 * `FormDataContextProvider` and the `TestHookFormProvider`. Allows props to
 * pass to their respective providers to make tests look leaner.
 */
export const TestProviderWrapper: React.FC<TestProviderType> = ({
  formDataState = formInitialState,
  hookFormState,
  children,
}) => {
  return (
    <FormDataContextProvider initState={formDataState}>
      <TestHookFormProvider {...hookFormState}>{children}</TestHookFormProvider>
    </FormDataContextProvider>
  );
};

/**
 * mockTFunction
 * @param en Object that contains English translations for testing
 *   specific components.
 */
export const mockTFunction = (en = {}): any => {
  return (str) => {
    let value = "";
    // Split the string value, such as "account.username.label".
    const keys = str.split(".");
    // The first one we want is from the `en` object.
    value = en[keys[0]];
    // Then any object after that must be from the `value`
    // object as we dig deeper.
    keys.forEach((k, index) => {
      if (index !== 0) {
        value = value[k];
      }
    });

    return value;
  };
};
