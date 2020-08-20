/* eslint-disable */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import { TestHookFormProvider } from "../../../testHelper/utils";
import AccountForm from "../AccountForm";
import {
  FormDataContextProvider,
  formInitialState,
} from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

describe("AccountForm", () => {
  beforeEach(() => {
    render(
      <TestHookFormProvider>
        <FormDataContextProvider initState={formInitialState}>
          <AccountForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
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

describe("AccountForm Accessibility check", () => {
  test("passes axe", async () => {
    const { container } = render(
      <TestHookFormProvider>
        <FormDataContextProvider initState={formInitialState}>
          <AccountForm />
        </FormDataContextProvider>
      </TestHookFormProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
