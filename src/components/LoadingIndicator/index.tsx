import React from "react";
import { ProgressIndicator } from "@nypl/design-system-react-components";

const LoadingIndicator = (
    <ProgressIndicator 
      isIndeterminate={true}
      indicatorType="circular" 
      labelText="Loading Indicator" 
      showLabel={false}
  />
);

export default LoadingIndicator;
