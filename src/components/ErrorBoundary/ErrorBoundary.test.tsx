import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ErrorBoundary from ".";
import { NRError } from "../../logger/newrelic";

jest.mock("../../logger/newrelic", () => ({
  NRError: jest.fn(),
}));

jest.mock("next/router", () => require("next-router-mock"));

// Errors are expected
beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const GoodComponent = () => <p>Hello, World.</p>;

const BadComponent = () => {
  throw new Error("Test render crash");
};

describe("ErrorBoundary", () => {
  test("passes axe accessibility test in fallback state", async () => {
    const { container } = render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders children when there is no error", () => {
    render(
      <ErrorBoundary reset="/">
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Hello, World.")).toBeInTheDocument();
  });

  test("renders the fallback UI when a child throws", () => {
    render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("There was an unexpected error")
    ).toBeInTheDocument();
    expect(screen.getByText(/new application/i)).toBeInTheDocument();
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
  });

  test("does not render children after a child throws", () => {
    render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    expect(screen.queryByText("Hello, World.")).not.toBeInTheDocument();
  });

  test("calls NRError with the error and component stack when a child throws", () => {
    const testError = new Error("Test render crash");

    render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    expect(NRError).toHaveBeenCalledWith(
      expect.objectContaining({ message: testError.message }),
      expect.objectContaining({
        customAttributes: expect.objectContaining({
          componentStack: expect.any(String),
        }),
      })
    );
  });

  test("clears the error state when the reset prop changes", () => {
    const { rerender } = render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("There was an unexpected error")
    ).toBeInTheDocument();

    rerender(
      <ErrorBoundary reset="/new">
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Hello, World.")).toBeInTheDocument();
    expect(
      screen.queryByText("There was an unexpected error")
    ).not.toBeInTheDocument();
  });

  test("does not clear the error state when the reset prop stays the same", () => {
    const { rerender } = render(
      <ErrorBoundary reset="/">
        <BadComponent />
      </ErrorBoundary>
    );

    rerender(
      <ErrorBoundary reset="/">
        <GoodComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("There was an unexpected error")
    ).toBeInTheDocument();
  });
});
