import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import { TestProviderWrapper } from "../../../testHelper/utils";
import AcceptTermsFormFields from ".";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
      },
      errorMessage: {
        acceptTerms: "The Terms and Conditions must be checked.",
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

describe("AcceptTermsFormFields accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AcceptTermsFormFields />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AcceptTermsFormFields", () => {
  beforeEach(() => {
    render(
      <TestProviderWrapper>
        <AcceptTermsFormFields />
      </TestProviderWrapper>
    );
  });

  test("renders text with three links", () => {
    expect(
      screen.getByText("Cardholder Terms and Conditions")
    ).toBeInTheDocument();
    expect(screen.getByText("Rules and Regulations")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  test("renders a checkbox", () => {
    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByLabelText(
      "Yes, I accept the terms and conditions."
    );

    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test("updates the checkbox", async () => {
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Unchecked by default.
    expect(checkbox.checked).toEqual(false);
    await act(async () => await fireEvent.click(checkbox));
    expect(checkbox.checked).toEqual(true);
  });
});
