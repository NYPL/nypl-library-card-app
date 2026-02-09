import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import PersonalFormFields from ".";

jest.mock("react-i18next", () => {
  const React = jest.requireActual("react");
  const en = {
    personal: {
      title: "Step 1 of 5: Personal information",
      firstName: {
        label: "First name",
      },
      lastName: {
        label: "Last name",
      },
      birthdate: {
        label: "Date of birth",
        instruction: "MM/DD/YYYY, including slashes",
      },
      email: {
        label: "Email address",
        instruction:
          "An email address is required to use many of our digital resources, such as e-books. If you do not wish to provide an email address, you can apply for a physical card using our <a href='https://on.nypl.org/internationalresearch'>alternate form</a>. Once filled out, please visit one of our <a href='https://www.nypl.org/locations'>locations</a> with proof of identity and home address to pick up your card.",
      },
      eCommunications: {
        labelText:
          "Yes, I would like to receive information about NYPL's programs and services",
      },
      errorMessage: {
        firstName: "There was a problem. Please enter a valid first name.",
        lastName: "There was a problem. Please enter a valid last name.",
        birthdate:
          "There was a problem. Please enter a valid date, MM/DD/YYYY, including slashes.",
        ageGate:
          "There was a problem. Date of birth is below the minimum age of 13.",
        email: "There was a problem. Please enter a valid email address.",
      },
    },
  };
  return {
    useTranslation: () => ({
      t: mockTFunction(en),
      i18n: { language: "en" },
    }),
    Trans: ({ children, i18nKey }) => {
      return React.createElement(
        "div",
        { "data-testid": `mock-trans` },
        i18nKey,
        children
      );
    },
  };
});

describe("PersonalFormFields", () => {
  beforeEach(() => {
    render(
      <TestProviderWrapper>
        <PersonalFormFields />
      </TestProviderWrapper>
    );
  });

  test("renders names, age, email, and newsletter fields", () => {
    expect(
      screen.getByRole("textbox", { name: "First name (required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Last name (required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Date of birth (required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email address (required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Yes, I would like to receive information about NYPL's programs and services"
      )
    ).toBeInTheDocument();
  });
});

describe("PersonalFormFields Accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <PersonalFormFields />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
