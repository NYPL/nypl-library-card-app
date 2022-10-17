import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressVerificationPage from "../pages/address-verification";
import { TestProviderWrapper, mockTFunction } from "../testHelper/utils";

jest.mock("react-i18next", () => {
  const en = {
    verifyAddress: {
      title: "Step 3 of 5: Address Verification",
      description: "Please select the correct address.",
      homeAddress: "Home Address",
      workAddress: "Alternate Address",
    },
  };

  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

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
      screen.getByText("Step 3 of 5: Address Verification")
    ).toBeInTheDocument();
  });
});
