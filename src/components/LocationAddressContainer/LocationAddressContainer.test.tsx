/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import LocationAddressContainer from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("LocationAddressContainer", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <LocationAddressContainer scrollRef={null} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders three location radio input", async () => {
    render(
      <TestProviderWrapper>
        <LocationAddressContainer scrollRef={null} />
      </TestProviderWrapper>
    );
    expect(
      screen.getByLabelText("New York City (All five boroughs)")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("New York State (Outside NYC)")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("United States (Visiting NYC)")
    ).toBeInTheDocument();
  });

  test("it doesn't render any address fields since no location is selected", () => {
    render(
      <TestProviderWrapper>
        <LocationAddressContainer scrollRef={null} />
      </TestProviderWrapper>
    );

    expect(screen.queryByLabelText("Home Address")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Work Address")).not.toBeInTheDocument();
  });

  test("it renders home and work address fields", async () => {
    render(
      <TestProviderWrapper>
        <LocationAddressContainer scrollRef={null} />
      </TestProviderWrapper>
    );

    const radionyc = screen.getByLabelText(
      "New York City (All five boroughs)",
      {
        selector: "input",
      }
    ) as HTMLInputElement;

    await fireEvent.click(radionyc);

    expect(radionyc).toBeChecked();
    expect(screen.getByText("Home Address")).toBeInTheDocument();
    expect(screen.getByText("Work Address")).toBeInTheDocument();
  });
});
