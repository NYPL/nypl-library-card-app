import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import { TestProviderWrapper } from "../../../testHelper/utils";
import PersonalFormFields from ".";

jest.mock("react-i18next", () => {
  const en = {
    personal: {
      title: "Step 1 of 5: Personal Information",
      firstName: {
        label: "First Name",
      },
      lastName: {
        label: "Last Name",
      },
      birthdate: {
        label: "Date of Birth",
        instructionText: "MM/DD/YYYY, including slashes",
      },
      email: {
        label: "Email Address",
        instructionText:
          "An email address is required to use many of our digital resources, such as e-books. If you do not wish to provide an email address, you can apply for a physical card using our <a href='https://legacycatalog.nypl.org/selfreg/patonsite'>alternate form</a>. Once filled out, please visit one of our <a href='https://www.nypl.org/locations'>locations</a> with proof of identity and home address to pick up your card.",
      },
      errorMessage: {
        firstName: "",
        lastName: "",
        birthdate: "",
        email: "",
      },
      eCommunications: {
        labelText:
          "Yes, I would like to receive information about NYPL's programs and services",
      },
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str) => {
        let value;
        const keys = str.split(".");
        value = en[keys[0]];
        // The `str` value is a dot delimited string which we want to
        // break up and get the right value from the deep object.
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
