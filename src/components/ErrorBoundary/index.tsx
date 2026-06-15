import { Text } from "@nypl/design-system-react-components";
import React from "react";
import { NRError } from "../../logger/newrelic";
import { BackToHomeLink, ContactUsLink, ErrorComponent } from "../Error";

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
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorComponent
          heading="There was an unexpected error"
          description={
            <Text maxWidth="730px" margin="auto">
              We couldn't process your request at this time. Your application
              progress may not have been saved. Try starting a{" "}
              <BackToHomeLink /> in a few minutes or <ContactUsLink /> if the
              error persists.
            </Text>
          }
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
