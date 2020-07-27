import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useParamsContext, {
  ParamsContextProvider,
} from "../src/context/ParamsContext";
import { Params } from "../src/interfaces";

const contextWrapper = (params?: Params) => ({ children }) => (
  <ParamsContextProvider params={params}>{children}</ParamsContextProvider>
);

describe("ParamsContext", () => {
  test("exposes a context `params` value", () => {
    const { result } = renderHook(() => useParamsContext(), {
      wrapper: contextWrapper(),
    });

    expect(result.current).toStrictEqual({});
  });

  test("it gets the object passed to the provider", () => {
    const queryParamsFromServer = {
      firstName: "Tom",
      lastName: "Nook",
      policyType: "simplye",
    };
    const { result } = renderHook(() => useParamsContext(), {
      wrapper: contextWrapper(queryParamsFromServer),
    });

    expect(result.current).toEqual(queryParamsFromServer);
  });
});
