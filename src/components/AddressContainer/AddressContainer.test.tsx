import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressContainer from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";

jest.mock("react-i18next", () => {
  const en = {
    location: {
      address: {
        title: "Home Address",
        description:
          "If you live in NYC, please fill out the home address form.",
        line1: { label: "Street Address" },
        line2: { label: "Apartment / Suite" },
        city: { label: "City" },
        state: { label: "State", instruction: "2-letter abbreviation" },
        postalCode: {
          label: "Postal Code",
          instruction: "5 or 9-digit postal code",
        },
      },
      workAddress: {
        title: "Alternate Address",
        description: {
          part1:
            "The application process is slightly different depending on whether you live, work, go to school, or pay property taxes in New York City, elsewhere in New York State, or elsewhere in the United States and you&apos;re just visiting New York City. Please select one of the following and fill out the required fields.",
          part2:
            "If you work or go to school in NYC please provide the address.",
        },
      },
      errorMessage: {
        line1: "There was a problem. Please enter a valid street address.",
        city: "There was a problem. Please enter a valid city.",
        state:
          "There was a problem. Please enter a 2-character state abbreviation.",
        zip: "There was a problem. Please enter a 5 or 9-digit postal code.",
      },
    },
    button: {
      start: "Get Started",
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

describe("AddressContainer", () => {
  test("passes axe accessibility checks", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressContainer csrfToken="test-token" />
        </TestProviderWrapper>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  test("it renders home address fields", async () => {
    render(
      <TestProviderWrapper>
        <AddressContainer csrfToken="test-token" />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
  });
});
