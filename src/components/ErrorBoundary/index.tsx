import {
  Heading,
  Text,
  Box,
  Template,
  TemplateMain,
  TemplateContent,
  TemplateHeader,
  TemplateBreakout,
  Link as DSLink,
} from "@nypl/design-system-react-components";
import Link from "next/link";
import React from "react";
import Breadcrumbs from "../Breadcrumb";
import { BrokenBook as BrokenBookIcon } from "../Icons/BrokenBook";
import { NRError } from "../../logger/newrelic";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  reset: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary that catches unexpected render errors and
 * displays a user-friendly message instead of a blank page
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>): void {
    if (prevProps.reset !== this.props.reset && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    NRError(error, {
      customAttributes: {
        compnentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorComponent>
          <Box mb="xl">
            <BrokenBookIcon />
          </Box>
          <Box textAlign="center">
            <Heading level="h2" size="heading3" mb="m">
              There was an unexpected error
            </Heading>
            <Text maxWidth="730px" margin="auto">
              We couldn't process your request at this time. Your application
              progress may not have been saved. Try starting a{" "}
              <Link href="/new">new application</Link> in a few minutes or{" "}
              <DSLink
                href="https://www.nypl.org/get-help/contact-us"
                variant="external"
              >
                contact us
              </DSLink>{" "}
              if the error persists.
            </Text>
          </Box>
        </ErrorComponent>
      );
    }
    return this.props.children;
  }
}

export const ErrorComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Template variant="narrow" gap="0!">
      <TemplateHeader id="mainHeader" m="0!" dir="ltr">
        <TemplateBreakout>
          <Breadcrumbs />
        </TemplateBreakout>
      </TemplateHeader>
      <TemplateMain id="mainContent">
        <TemplateContent my="xxl" textAlign="center">
          {children}
        </TemplateContent>
      </TemplateMain>
    </Template>
  );
};

export default ErrorBoundary;
