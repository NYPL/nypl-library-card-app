/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import { TestHookFormProvider } from "../../../testHelper/utils";
import PersonalInformationForm from "../PersonalInformationForm";
import { FormDataContextProvider } from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

describe("PersonalInformationForm", () => {
  beforeEach(() => {
    render(
      <TestHookFormProvider>
        <FormDataContextProvider>
          <PersonalInformationForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
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

describe("Accessibility check", () => {
  test("passes axe", async () => {
    const { container } = render(
      <TestHookFormProvider>
        <FormDataContextProvider>
          <PersonalInformationForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
