import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import FormField from ".";

describe("FormField", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <>
        <FormField id="textField" label="a text field" name="text" isRequired />
        <FormField
          id="passwordField"
          label="a password field"
          name="password"
          type="password"
          isRequired
        />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders a label and an input element", () => {
    const { container } = render(
      <FormField id="textField" label="a text field" name="text" isRequired />
    );

    expect(screen.getByLabelText(/a text field/i)).toBeInTheDocument();
    expect(container.querySelector("input[type='text']")).toBeInTheDocument();
  });

  test("it renders a required label", () => {
    render(
      <FormField id="textField" label="a text field" name="text" isRequired />
    );

    expect(screen.getByLabelText(/a text field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Required/i)).toBeInTheDocument();
  });

  test("it renders instructional text", () => {
    render(
      <FormField
        id="textField"
        label="a text field"
        name="text"
        instructionText="Some instructional text"
      />
    );

    expect(screen.getByText("Some instructional text")).toBeInTheDocument();
  });
});
