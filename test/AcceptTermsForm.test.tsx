/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AcceptTermsForm from "../src/components/AcceptTermsForm";

describe("AcceptTermsForm", () => {
  beforeEach(() => {
    const mockRegister = jest.fn();

    render(<AcceptTermsForm register={mockRegister} />);
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
