import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressVerificationPage from "../pages/address-verification";
import { TestProviderWrapper, mockTFunction } from "../testHelper/utils";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn(() => ({
    matches: false,
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
  })),
});

jest.mock("react-i18next", () => {
  const en = {
    verifyAddress: {
      title: "Step 3 of 5: Address verification",
      description: "Please select the correct address.",
      homeAddress: "Home address",
      workAddress: "Alternate address",
    },
    button: {
      start: "Get started",
      edit: "Edit",
      submit: "Submit",
      next: "Next",
      previous: "Previous",
    },
  };

  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

jest.mock("next/router", () => require("next-router-mock"));

describe("AddressVerificationPage accessibility", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressVerificationPage />
        </TestProviderWrapper>
      );

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("AddressVerificationPage", () => {
  test("renders a title and description", () => {
    render(
      <TestProviderWrapper>
        <AddressVerificationPage />
      </TestProviderWrapper>
    );
    expect(
      screen.getByText("Step 3 of 5: Address verification")
    ).toBeInTheDocument();
  });
});
