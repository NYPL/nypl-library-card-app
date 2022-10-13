/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressContainer from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";

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
        line1: "Please enter a valid street address.",
        city: "Please enter a valid city.",
        state: "Please enter a 2-character state abbreviation.",
        zip: "Please enter a 5 or 9-digit postal code.",
      },
    },
  };

  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str) => {
        let value = "";
        // Split the string value, such as "account.username.label".
        const keys = str.split(".");
        // The first one we want is from the `en` object.
        value = en[keys[0]];
        // Then any object after that must be from the `value`
        // object as we dig deeper.
        keys.forEach((k, index) => {
          if (index !== 0) {
            value = value[k];
          }
        });

        return value;
      },
    }),
  };
});

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
