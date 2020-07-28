import React from "react";
import { useForm, FormProvider } from "react-hook-form";

interface MockMethods {
  errors?: {};
  // The types coming from `react-hook-form` for its functions.
  getValues?: () => { [x: string]: any };
  watch?: () => { [x: string]: any };
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
