import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import FormField from ".";

expect.extend(toHaveNoViolations);

describe("FormField", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <>
        <FormField
          id="textField"
          label="a text field"
          fieldName="text"
          isRequired
        />
        <FormField
          id="passwordField"
          label="a password field"
          fieldName="password"
          type="password"
          isRequired
        />
        <FormField
          id="radioField"
          label="a radio field"
          fieldName="radio"
          type="radio"
        />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders a label and an input element", () => {
    const { container } = render(
      <FormField
        id="textField"
        label="a text field"
        fieldName="text"
        isRequired
      />
    );

    expect(screen.getByLabelText(/a text field/i)).toBeInTheDocument();
    expect(container.querySelector("input[type='text']")).toBeInTheDocument();
  });

  test("it renders a required label", () => {
    render(
      <FormField
        id="textField"
        label="a text field"
        fieldName="text"
        isRequired
      />
    );

    expect(screen.getByLabelText(/a text field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Required/i)).toBeInTheDocument();
  });

  test("it renders instructional text", () => {
    render(
      <FormField
        id="textField"
        label="a text field"
        fieldName="text"
        instructionText="Some instructional text"
      />
    );

    expect(screen.getByText("Some instructional text")).toBeInTheDocument();
  });
});
