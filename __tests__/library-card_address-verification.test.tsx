/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AddressVerificationPage from "../pages/library-card/address-verification";
import { TestProviderWrapper } from "../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("AddressVerificationPage accessibility", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AddressVerificationPage />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AddressVerificationPage", () => {
  test("renders a title and decription", () => {
    render(
      <TestProviderWrapper>
        <AddressVerificationPage />
      </TestProviderWrapper>
    );
    expect(
      screen.getByText("Step 3 of 5: Address Verification")
    ).toBeInTheDocument();
  });
});
