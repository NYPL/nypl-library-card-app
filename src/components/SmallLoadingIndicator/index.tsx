import React from "react";
import { ProgressIndicator } from "@nypl/design-system-react-components";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const SmallLoadingIndicator = ({ isLoading }: LoadingIndicatorProps) =>
  isLoading && (
    <ProgressIndicator
      isIndeterminate={true}
      indicatorType="circular"
      labelText="Loading Indicator"
      showLabel={false}
      size="small"
    />
  );

export default SmallLoadingIndicator;
