import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import React from "react";

import ReviewPage from "../pages/review";
import { TestProviderWrapper } from "../testHelper/utils";
import { getPageTitles } from "../src/utils/utils";

describe("ReviewPage", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <TestProviderWrapper>
        <ReviewPage pageTitles={getPageTitles("nyc")} />
      </TestProviderWrapper>
    );

    container = utils.container;
  });

  test("passes axe accessibility test", async () => {
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a title and decription", () => {
    expect(
      screen.getByText("Step 5 of 5: Confirm Your Information")
    ).toBeInTheDocument();
  });
});
