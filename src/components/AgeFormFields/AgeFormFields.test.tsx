import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AgeFormFields from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";

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
        instruction: "MM/DD/YYYY, including slashes",
      },
      email: {
        label: "Email Address",
        instruction:
          "An email address is required to use many of our digital resources, such as e-books. If you do not wish to provide an email address, you can apply for a physical card using our <a href='https://legacycatalog.nypl.org/selfreg/patonsite'>alternate form</a>. Once filled out, please visit one of our <a href='https://www.nypl.org/locations'>locations</a> with proof of identity and home address to pick up your card.",
      },
      eCommunications: {
        labelText:
          "Yes, I would like to receive information about NYPL's programs and services",
      },
      errorMessage: {
        firstName: "Please enter a valid first name.",
        lastName: "Please enter a valid last name.",
        birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
        ageGate: "You must be 13 years or older to continue.",
        email: "Please enter a valid email address.",
      },
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

const ageFormErrorMessages = {
  ageGate: "You must be 13 years or older to continue.",
  birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
};
// The `errors` object shape from `react-hook-form`.
const reactHookFormErrors = {
  ageGate: {
    message: "You must be 13 years or older to continue.",
  },
  birthdate: {
    message: "Please enter a valid date, MM/DD/YYYY, including slashes.",
  },
};

describe("AgeFormFields", () => {
  test("it passes axe accessibility checks for the field input", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AgeFormFields />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it passes axe accessibility checks for the checkbox input", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AgeFormFields policyType="simplye" />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders an input field with the default webApplicant policyType", () => {
    render(
      <TestProviderWrapper>
        <AgeFormFields />
      </TestProviderWrapper>
    );

    const description = screen.getByText("MM/DD/YYYY, including slashes");
    const input = screen.getByRole("textbox", {
      name: "Date of Birth (Required)",
    });
    const checkbox = screen.queryByRole("checkbox");
    const label = screen.queryByLabelText("Yes, I am over 13 years old.");

    expect(description).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(checkbox).not.toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });

  test.skip("it renders a checkbox with the simplye policyType", () => {
    render(
      <TestProviderWrapper>
        <AgeFormFields policyType="simplye" />
      </TestProviderWrapper>
    );

    const description = screen.queryByText("MM/DD/YYYY, including slashes");
    const input = screen.queryByRole("textbox", {
      name: "Date of Birth (Required)",
    });
    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByLabelText("Yes, I am over 13 years old.");

    expect(description).not.toBeInTheDocument();
    expect(input).not.toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test.skip("updates the age gate checkbox", async () => {
    render(
      <TestProviderWrapper>
        <AgeFormFields policyType="simplye" />
      </TestProviderWrapper>
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Unchecked by default.
    expect(checkbox.checked).toEqual(false);
    await act(async () => await fireEvent.click(checkbox));
    expect(checkbox.checked).toEqual(true);
  });

  test("it should render a webApplicant error message", () => {
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AgeFormFields />
      </TestProviderWrapper>
    );

    const inputError = screen.getByText(ageFormErrorMessages["birthdate"]);
    expect(inputError).toBeInTheDocument();
  });

  test.skip("it should render a simplye error message", () => {
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AgeFormFields policyType="simplye" />
      </TestProviderWrapper>
    );

    const inputError = screen.getByText(ageFormErrorMessages["ageGate"]);
    expect(inputError).toBeInTheDocument();
  });
});
