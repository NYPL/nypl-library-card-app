import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import useIPLocationContext, {
  IPLocationContextProvider,
} from "../IPLocationContext";
import { LocationResponse } from "../../interfaces";

const userLocation: LocationResponse = {
  inUS: false,
  inNYState: false,
  inNYCity: false,
};
const contextWrapper = () => ({ children }) => (
  <IPLocationContextProvider userLocation={userLocation}>
    {children}
  </IPLocationContextProvider>
);

describe("IPLocationContext", () => {
  test("exposes a context `userLocation` prop that has a value object", () => {
    const { result } = renderHook(() => useIPLocationContext(), {
      wrapper: contextWrapper(),
    });

    expect(result.current.inUS).toEqual(false);
    expect(result.current.inNYState).toEqual(false);
    expect(result.current.inNYCity).toEqual(false);
  });
});
