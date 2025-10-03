import React from "react";
import useFormDataContext, {
  FormDataContextProvider,
} from "../FormDataContext";
import { FormData, FormInputData, AddressesResponse } from "../../interfaces";
import { renderHook } from "@testing-library/react-hooks";

const initState: FormData = {
  results: undefined,
  errorObj: null,
  formValues: {
    ecommunicationsPref: true,
    policyType: "webApplicant",
  } as FormInputData,
  addressesResponse: {} as AddressesResponse,
};
const contextWrapper =
  () =>
  ({ children }) => (
    <FormDataContextProvider initState={initState}>
      {children}
    </FormDataContextProvider>
  );

describe("FormDataContext", () => {
  test("exposes a context `value` prop that has a function and a value object", () => {
    const { result } = renderHook(() => useFormDataContext(), {
      wrapper: contextWrapper(),
    });

    expect(typeof result.current.dispatch).toEqual("function");
    expect(result.current.state).toEqual(initState);
  });
});
