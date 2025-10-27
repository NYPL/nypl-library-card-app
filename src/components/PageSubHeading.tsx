import { Heading } from "@nypl/design-system-react-components";

export const PageSubHeading = ({ children, ...rest }) => {
  return (
    <Heading level="h3" size="heading5" {...rest}>
      {children}
    </Heading>
  );
};
