import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { TestProviderWrapper } from "../../../testHelper/utils";
import PersonalFormFields from ".";

jest.mock("react-i18next", () => {
  const en = {
    personal: {
      firstName: "First Name",
      lastName: "Last Name",
      dob: "Date of Birth",
      dobInstruction: "MM/DD/YYYY, including slashes",
      email: "Email Address",
      emailInstruction:
        "An email address is required to use many of our digital resources, such as e-books. If you do not wish to provide an email address, you can apply for a physical card using our <a href='https://catalog.nypl.org/selfreg/patonsite'>alternate form</a>.Once filled out, please visit one of our <a href='https://www.nypl.org/locations'>locations</a> with proof of identity and home address to pick up your card.",
      newsletter:
        "Yes, I would like to receive information about NYPL's programs and services",
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str) => en["personal"][str.substr(str.indexOf(".") + 1)],
    }),
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
      screen.getByRole("textbox", { name: "First Name (Required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Last Name (Required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Date of Birth (Required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email Address (Required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
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
