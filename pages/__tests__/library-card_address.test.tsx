/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import AddressPage from "../library-card/address";
import { FormDataContextProvider } from "../../src/context/FormDataContext";
import { TestHookFormProvider } from "../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("AddressPage", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <FormDataContextProvider>
        <TestHookFormProvider>
          <AddressPage />
        </TestHookFormProvider>
      </FormDataContextProvider>
    );

    container = utils.container;
  });

  test("passes axe", async () => {
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a title and decription", () => {
    expect(screen.getByText("Confirm your Address")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We have found an alternate address for you. Please choose which is correct:"
      )
    ).toBeInTheDocument();
  });
});
