/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AddressContainer from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("AddressContainer", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AddressContainer />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders home address fields", async () => {
    render(
      <TestProviderWrapper>
        <AddressContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
  });
});
