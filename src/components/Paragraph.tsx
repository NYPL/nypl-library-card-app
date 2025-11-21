import { Box } from "@nypl/design-system-react-components";

export const Paragraph: typeof Box = ({ children, ...rest }) => {
  return (
    <Box my="s" {...rest}>
      {children}
    </Box>
  );
};
