import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import AcceptTermsFormFields from ".";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
        text:
          "By submitting an application, you understand and agree to our <a href='https://www.nypl.org/help/library-card/terms-conditions'>Cardholder Terms and Conditions</a> and agree to our <a href='https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations'>Rules and Regulations</a>. To learn more about the Library’s use of personal information, please read our <a href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'>Privacy Policy</a>.",
      },
      errorMessage: {
        acceptTerms: "The Terms and Conditions must be checked.",
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
    const checkbox = screen.getByRole("checkbox");

    // Unchecked by default.
    expect(checkbox.checked).toEqual(false);
    await act(() => fireEvent.click(checkbox));
    expect(checkbox.checked).toEqual(true);
  });
});
