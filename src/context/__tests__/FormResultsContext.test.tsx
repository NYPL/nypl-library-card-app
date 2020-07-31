import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useFormResultsContext, {
  FormResultsContextProvider,
} from "../FormResultsContext";
import { FormResults, FormResultsContextType } from "../../interfaces";

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  pin: "1234",
  temporary: false,
  message: "The library card will be a standard library card.",
  patronId: 1234567,
};
const setFormResults = jest.fn();

const contextWrapper = (value: FormResultsContextType) => ({ children }) => (
  <FormResultsContextProvider value={value}>
    {children}
  </FormResultsContextProvider>
);

describe("ParamsContext", () => {
  test("exposes a context `value` prop that has a function and a value object", () => {
    const formProps: FormResultsContextType = {
      setFormResults,
      formResults,
    };
    const { result } = renderHook(() => useFormResultsContext(), {
      wrapper: contextWrapper(formProps),
    });

    expect(typeof result.current.setFormResults).toEqual("function");
    expect(result.current.formResults).toEqual(formResults);
  });
});
