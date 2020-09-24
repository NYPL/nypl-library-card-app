/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ReviewPage from "../pages/library-card/review";
import { TestProviderWrapper } from "../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("ReviewPage", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <TestProviderWrapper>
        <ReviewPage />
      </TestProviderWrapper>
    );

    container = utils.container;
  });

  test("passes axe accessibility test", async () => {
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a title and decription", () => {
    expect(
      screen.getByText("Step 6 of 6: Review Your Information")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "You have entered the information listed below. Please review before submitting."
      )
    ).toBeInTheDocument();
  });
});
