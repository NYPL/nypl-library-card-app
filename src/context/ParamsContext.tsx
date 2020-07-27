import React from "react";
import { Params } from "../interfaces";
const ParamsContext = React.createContext<Params | undefined>(undefined);

export const ParamsContextProvider: React.FC<{ params: Params }> = ({
  params = {},
  children,
}) => (
  <ParamsContext.Provider value={params}>{children}</ParamsContext.Provider>
);

export default function useParamsContext() {
  const context = React.useContext(ParamsContext);
  if (typeof context === "undefined") {
    throw new Error(
      "useParamsContext must be used within a ParamsContextProvider"
    );
  }

  return context;
}
