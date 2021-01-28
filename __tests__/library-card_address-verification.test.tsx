import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressVerificationPage from "../pages/address-verification";
import { TestProviderWrapper } from "../testHelper/utils";
import { getPageTitles } from "../src/utils/utils";

describe("AddressVerificationPage accessibility", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressVerificationPage pageTitles={getPageTitles("nyc")} />
        </TestProviderWrapper>
      );

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("AddressVerificationPage", () => {
  test("renders a title and decription", () => {
    render(
      <TestProviderWrapper>
        <AddressVerificationPage pageTitles={getPageTitles("nyc")} />
      </TestProviderWrapper>
    );
    expect(
      screen.getByText("Step 3 of 5: Address Verification")
    ).toBeInTheDocument();
  });
});
