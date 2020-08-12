/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import ReviewPage from "../library-card/review";
import { FormDataContextProvider } from "../../src/context/FormDataContext";
import { TestHookFormProvider } from "../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("ReviewPage", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <FormDataContextProvider>
        <TestHookFormProvider>
          <ReviewPage />
        </TestHookFormProvider>
      </FormDataContextProvider>
    );

    container = utils.container;
  });

  test("passes axe", async () => {
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a title and decription", () => {
    expect(screen.getByText("Verify your Information")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have entered the information listed below. Please review before submitting."
      )
    ).toBeInTheDocument();
  });
});
