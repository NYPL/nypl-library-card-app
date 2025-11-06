import { Heading } from "@nypl/design-system-react-components";

/**
 * PageHeading component that's used for the main heading component on each page
 */
export const PageHeading = ({ children, ...rest }) => {
  return (
    <Heading level="h2" mb="s" size="heading3" {...rest}>
      {children}
    </Heading>
  );
};
