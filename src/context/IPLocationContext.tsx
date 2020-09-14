import React from "react";

interface LocationResponse {
  inUS: boolean;
  inNYState: boolean;
  inNYCBounds: boolean;
}
const IPLocationContext = React.createContext<
  LocationResponse | null | undefined
>(undefined);

export const IPLocationContextProvider: React.FC<{
  userLocation: LocationResponse;
}> = ({ userLocation, children }) => (
  <IPLocationContext.Provider value={userLocation}>
    {children}
  </IPLocationContext.Provider>
);

/**
 * useIPLocationContext
 * Custom context hook to get the location response from an IP check.
 */
export default function useIPLocationContext() {
  const context = React.useContext(IPLocationContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useIPLocationContext must be used within a IPLocationContextProvider"
    );
  }

  return context;
}
