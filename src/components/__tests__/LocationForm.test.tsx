/* eslint-disable */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import LocationForm from "../LocationForm";
import { TestProviderWrapper } from "../../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("LocationForm", () => {
  const errorMessage = "Please select an address option.";
  const nyc = "New York City (All five boroughs)";
  const nys = "New York State (Outside NYC)";
  const us = "United States (Visiting NYC)";

  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <LocationForm errorMessage={errorMessage} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders an alternate form link", () => {
    render(
      <TestProviderWrapper>
        <LocationForm errorMessage={errorMessage} />
      </TestProviderWrapper>
    );

    expect(screen.getByText("alternate form")).toBeInTheDocument();
  });

  test("renders three radio buttons", () => {
    render(
      <TestProviderWrapper>
        <LocationForm errorMessage={errorMessage} />
      </TestProviderWrapper>
    );

    expect(screen.getByLabelText(nyc)).toBeInTheDocument();
    expect(screen.getByLabelText(nys)).toBeInTheDocument();
    expect(screen.getByLabelText(us)).toBeInTheDocument();
  });

  test("updates the value selected", async () => {
    render(
      <TestProviderWrapper>
        <LocationForm errorMessage={errorMessage} />
      </TestProviderWrapper>
    );

    let radio = screen.getByLabelText(nyc) as HTMLInputElement;

    expect(radio.value).toBe("nyc");

    await fireEvent.change(radio, { target: { value: "nys" } });
    expect(radio.value).toBe("nys");

    await fireEvent.change(radio, { target: { value: "us" } });
    expect(radio.value).toBe("us");
  });

  test("renders an error message if there is one from react-hook-form", () => {
    const reactHookFormErrors = {
      location: {
        message: errorMessage,
      },
    };
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <LocationForm errorMessage={errorMessage} />
      </TestProviderWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
