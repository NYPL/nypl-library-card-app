/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import { TestProviderWrapper } from "../../../testHelper/utils";
import PersonalInformationForm from "../PersonalInformationForm";

expect.extend(toHaveNoViolations);

describe("PersonalInformationForm", () => {
  beforeEach(() => {
    render(
      <TestProviderWrapper>
        <PersonalInformationForm />
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
    expect(screen.getByRole("textbox", { name: "E-mail" })).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        "Yes, I would like to receive information about NYPL's programs and services"
      )
    ).toBeInTheDocument();
  });
});

describe("PersonalInformationForm Accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <PersonalInformationForm />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
