/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { TestProviderWrapper } from "../../../testHelper/utils";
import AccountForm from "./AccountForm";

expect.extend(toHaveNoViolations);

describe("AccountForm", () => {
  beforeEach(() => {
    render(
      <TestProviderWrapper>
        <AccountForm />
      </TestProviderWrapper>
    );
  });

  test("renders username, pin, and home library code fields", () => {
    expect(
      screen.getByRole("textbox", { name: "Username Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "PIN Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Home Library:" })
    ).toBeInTheDocument();
  });
});

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
