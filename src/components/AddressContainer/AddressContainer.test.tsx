/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressContainer from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";

describe("AddressContainer", () => {
  test("passes axe accessibility checks", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressContainer />
        </TestProviderWrapper>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
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
