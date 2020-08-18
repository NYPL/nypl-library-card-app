import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFormDataContext, {
  FormDataContextProvider,
} from "../FormDataContext";
import { FormData, FormInputData } from "../../interfaces";

const initState: FormData = {
  results: undefined,
  errorObj: null,
  csrfToken: null,
  formValues: {} as FormInputData,
};
const contextWrapper = () => ({ children }) => (
  <FormDataContextProvider>{children}</FormDataContextProvider>
);

describe("ParamsContext", () => {
  test("exposes a context `value` prop that has a function and a value object", () => {
    const { result } = renderHook(() => useFormDataContext(), {
      wrapper: contextWrapper(),
    });

    expect(typeof result.current.dispatch).toEqual("function");
    expect(result.current.state).toEqual(initState);
  });
});
