import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import AgeForm from "../src/components/AgeForm";

expect.extend(toHaveNoViolations);

const mockRegister = jest.fn();
const noHookFormErrors = {};
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

describe("AgeForm", () => {
  test("it passes accessibility checks for the field input", async () => {
    const { container } = render(
      <AgeForm
        register={mockRegister}
        errors={noHookFormErrors}
        errorMessages={noHookFormErrors}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it passes accessibility checks for the checkbox input", async () => {
    const { container } = render(
      <AgeForm
        policyType="simplye"
        register={mockRegister}
        errors={noHookFormErrors}
        errorMessages={noHookFormErrors}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders an input field with the default webApplicant policyType", () => {
    render(
      <AgeForm
        register={mockRegister}
        errors={noHookFormErrors}
        errorMessages={noHookFormErrors}
      />
    );

    const description = screen.getByText("MM/DD/YYYY, including slashes");
    const input = screen.getByRole("textbox", {
      name: "Date of Birth Required",
    });
    const checkbox = screen.queryByRole("checkbox");
    const label = screen.queryByLabelText("Yes, I am over 13 years old.");

    expect(description).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(checkbox).not.toBeInTheDocument();
    expect(label).not.toBeInTheDocument();
  });

  test("it renders a checkbox with the simplye policyType", () => {
    render(
      <AgeForm
        policyType="simplye"
        register={mockRegister}
        errors={noHookFormErrors}
        errorMessages={noHookFormErrors}
      />
    );

    const description = screen.queryByText("MM/DD/YYYY, including slashes");
    const input = screen.queryByRole("textbox", {
      name: "Date of Birth Required",
    });
    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByLabelText("Yes, I am over 13 years old.");

    expect(description).not.toBeInTheDocument();
    expect(input).not.toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test("updates the age gate checkbox", async () => {
    render(
      <AgeForm
        policyType="simplye"
        register={mockRegister}
        errors={noHookFormErrors}
        errorMessages={noHookFormErrors}
      />
    );

    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Unchecked by default.
    expect(checkbox.checked).toEqual(false);
    await act(async () => await fireEvent.click(checkbox));
    expect(checkbox.checked).toEqual(true);
  });

  test("it should render a webApplicant error message", () => {
    render(
      <AgeForm
        register={mockRegister}
        errors={reactHookFormErrors}
        errorMessages={ageFormErrorMessages}
      />
    );

    const inputError = screen.getByText(ageFormErrorMessages["birthdate"]);
    expect(inputError).toBeInTheDocument();
  });

  test("it should render a simplye error message", () => {
    render(
      <AgeForm
        policyType="simplye"
        register={mockRegister}
        errors={reactHookFormErrors}
        errorMessages={ageFormErrorMessages}
      />
    );

    const inputError = screen.getByText(ageFormErrorMessages["ageGate"]);
    expect(inputError).toBeInTheDocument();
  });
});
