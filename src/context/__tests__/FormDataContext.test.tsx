import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFormDataContext, {
  FormDataContextProvider,
} from "../FormDataContext";
import { FormData, FormResults, FormDataContextType } from "../../interfaces";

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  pin: "1234",
  temporary: false,
  message: "The library card will be a standard library card.",
  patronId: 1234567,
};
const state: FormData = {
  results: formResults,
  errorObj: {},
  isLoading: false,
  csrfToken: null,
};
const dispatch = jest.fn();

const contextWrapper = (value: FormDataContextType) => ({ children }) => (
  <FormDataContextProvider value={value}>{children}</FormDataContextProvider>
);

describe("ParamsContext", () => {
  test("exposes a context `value` prop that has a function and a value object", () => {
    const formProps: FormDataContextType = {
      dispatch,
      state,
    };
    const { result } = renderHook(() => useFormDataContext(), {
      wrapper: contextWrapper(formProps),
    });

    expect(typeof result.current.dispatch).toEqual("function");
    expect(result.current.state).toEqual({
      results: formResults,
      errorObj: {},
      isLoading: false,
      csrfToken: null,
    });
  });
});
