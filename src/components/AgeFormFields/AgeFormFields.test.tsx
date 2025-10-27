import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import AgeFormFields from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import { formInitialState } from "../../context/FormDataContext";

jest.mock("react-i18next", () => {
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
        firstName: "Please enter a valid first name.",
        lastName: "Please enter a valid last name.",
        birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
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
  birthdate: "Please enter a valid date, MM/DD/YYYY, including slashes.",
};
// The `errors` object shape from `react-hook-form`.
const reactHookFormErrors = {
  birthdate: {
    name: "birthdate",
    message: "Please enter a valid date, MM/DD/YYYY, including slashes.",
  },
};

describe("AgeFormFields", () => {
  test("it passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AgeFormFields />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders an input field", () => {
    render(
      <TestProviderWrapper>
        <AgeFormFields />
      </TestProviderWrapper>
    );

    const description = screen.getByText("MM/DD/YYYY, including slashes");
    const input = screen.getByRole("textbox", {
      name: "Date of birth (required)",
    });

    expect(description).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  test("it should render a valid birthdate", () => {
    render(
      <TestProviderWrapper
        formDataState={{
          ...formInitialState,
          formValues: {
            ...formInitialState.formValues,
            birthdate: "12/10/1815",
          },
        }}
        hookFormState={{
          errors: reactHookFormErrors.birthdate,
          formOptions: {
            mode: "onBlur",
            reValidateMode: "onBlur",
          },
        }}
      >
        <AgeFormFields />
      </TestProviderWrapper>
    );

    const input = screen.getByRole("textbox", {
      name: "Date of birth (required)",
    });

    fireEvent.blur(input);

    const description = screen.getByText("MM/DD/YYYY, including slashes");
    expect(description).toBeInTheDocument();

    const inputError = screen.queryByText(ageFormErrorMessages["birthdate"]);
    expect(inputError).not.toBeInTheDocument();
  });

  test("it should render a birthdate error message", async () => {
    render(
      <TestProviderWrapper
        formDataState={{
          ...formInitialState,
          formValues: {
            ...formInitialState.formValues,
            birthdate: "50/50/3001",
          },
        }}
        hookFormState={{
          errors: reactHookFormErrors.birthdate,
          formOptions: {
            mode: "onBlur",
            reValidateMode: "onBlur",
          },
        }}
      >
        <AgeFormFields />
      </TestProviderWrapper>
    );

    const input = screen.getByRole("textbox", {
      name: "Date of birth (required)",
    });

    fireEvent.blur(input);

    await waitFor(() => {
      const inputError = screen.getByText(ageFormErrorMessages["birthdate"]);
      expect(inputError).toBeInTheDocument();
    });
  });
});
