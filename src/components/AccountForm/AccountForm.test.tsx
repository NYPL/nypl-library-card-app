import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { TestProviderWrapper } from "../../../testHelper/utils";
import AccountForm from ".";

expect.extend(toHaveNoViolations);

describe("AccountForm accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AccountForm />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AccountForm", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <TestProviderWrapper>
        <AccountForm />
      </TestProviderWrapper>
    );
    container = utils.container;
  });

  test("renders username, pin, verify pin, and checkbox fields", () => {
    expect(
      screen.getByRole("textbox", { name: "Username Required" })
    ).toBeInTheDocument();
    // Password input types don't have roles so `getByRole` doesn't work.
    // `getByLabelText(/PIN/i)` is too generic and gets both instances and
    // `getByLabelText(/PIN Required/i)` doesn't find anything.
    expect(
      container.querySelector("input[type='password']")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Verify PIN/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Show PIN" })
    ).toBeInTheDocument();
  });

  test("renders username, pin, verify pin, and checkbox fields", async () => {
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Unchecked by default.
    // By default, the PIN and verify PIN fields are "password" types.
    expect(checkbox.checked).toEqual(false);
    expect(
      container.querySelector("input[type='password']")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Verify PIN/i)).toBeInTheDocument();

    await act(async () => await fireEvent.click(checkbox));

    // But once the checkbox is checked, the PIN fields before text fields
    // so that users can see their values.
    expect(checkbox.checked).toEqual(true);
    expect(
      container.querySelector("input[type='password']")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "PIN Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Verify PIN Required" })
    ).toBeInTheDocument();
  });
});
