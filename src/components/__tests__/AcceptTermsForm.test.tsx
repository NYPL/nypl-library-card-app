/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import { TestHookFormProvider } from "../../../testHelper/utils";
import AcceptTermsForm from "../AcceptTermsForm";
import {
  FormDataContextProvider,
  formInitialState,
} from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

describe("AcceptTermsForm", () => {
  beforeEach(() => {
    render(
      <TestHookFormProvider>
        <FormDataContextProvider initState={formInitialState}>
          <AcceptTermsForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
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

describe("Accessibility check", () => {
  test("passes axe", async () => {
    const { container } = render(
      <TestHookFormProvider>
        <FormDataContextProvider initState={formInitialState}>
          <AcceptTermsForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
