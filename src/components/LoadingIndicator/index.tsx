import React from "react";
import { Box, ProgressIndicator } from "@nypl/design-system-react-components";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator = ({ isLoading }: LoadingIndicatorProps) =>
  isLoading && (
    <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw" // 100% of viewport width
        height="100vh" // 100% of viewport height
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="rgba(255, 255, 255, 0.8)" // Semi-transparent background
        zIndex="9999"
      >
        <ProgressIndicator
          isIndeterminate={true}
          indicatorType="circular"
          labelText="Loading Indicator"
          showLabel={false}
        />
      </Box>
  );

export default LoadingIndicator;
