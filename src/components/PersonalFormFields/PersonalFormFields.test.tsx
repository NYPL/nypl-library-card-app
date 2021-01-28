import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { TestProviderWrapper } from "../../../testHelper/utils";
import PersonalFormFields from ".";

describe("PersonalFormFields", () => {
  beforeEach(() => {
    render(
      <TestProviderWrapper>
        <PersonalFormFields />
      </TestProviderWrapper>
    );
  });

  test("renders names, age, email, and newsletter fields", () => {
    expect(
      screen.getByRole("textbox", { name: "First Name Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Last Name Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Date of Birth Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Email Address Required" })
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "Yes, I would like to receive information about NYPL's programs and services"
      )
    ).toBeInTheDocument();
  });
});

describe("PersonalFormFields Accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <PersonalFormFields />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
