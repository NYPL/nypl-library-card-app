import React from "react";
import { Box, Flex } from "@nypl/design-system-react-components";
import { keyframes } from "@chakra-ui/react";

interface LoaderProps {
  isLoading: boolean;
}

const shine = keyframes`
  to {
    background-position: 100% 0, 0 0, 0 40px, 0 67px, 0 94px, 0 121px, 0 148px, 0 175px;
  }
`;

const Loader = ({ isLoading }: LoaderProps) =>
  isLoading && (
    <Flex
      opacity="60%"
      height="100vh"
      width="100%"
      position="fixed"
      top="0"
      left="0"
      padding="s"
      justifyContent="center"
      alignItems="center"
      backgroundColor="ui.gray.light-warm"
    >
      <Box
        flex="1"
        m="0 auto"
        maxW="50%"
        height="60px"
        backgroundImage="linear-gradient(
            100deg,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 80%
          ),
          linear-gradient(var(--nypl-colors-ui-gray-medium) 33px, transparent 0);"
        backgroundRepeat="repeat-y"
        backgroundSize="50px 230px, 800px 830px"
        backgroundPosition="0 0, 0px 0px"
        animation={`${shine} 1s infinite`}
      />
    </Flex>
  );

export default Loader;
