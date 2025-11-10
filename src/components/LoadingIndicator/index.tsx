import React from "react";
import { ProgressIndicator } from "@nypl/design-system-react-components";

interface LoaderProps {
  isLoading: boolean;
}

const LoadingIndicator = ({ isLoading }: LoaderProps) =>
  isLoading && (
  <ProgressIndicator
    isIndeterminate={true}
    indicatorType="circular"
    labelText="Loading Indicator"
    showLabel={false}
  />
  );

export default LoadingIndicator;
