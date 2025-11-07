import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import React from "react";
import {
  mockConfirmation,
  mockPersonal,
  mockAccount,
  mockReview,
  mockButton,
  mockLocation,
} from "./fixtures/react-i18next-fixtures";
import router from "next/router";

import ReviewPage from "../pages/review";
import { TestProviderWrapper, mockTFunction } from "../testHelper/utils";

jest.mock("next/router", () => {
  const mockRouter = jest.requireActual("next-router-mock");
  return { ...mockRouter, push: jest.fn() };
});

jest.mock("react-i18next", () => {
  const en = {
    confirmation: mockConfirmation,
    personal: mockPersonal,
    account: mockAccount,
    review: mockReview,
    button: mockButton,
    location: mockLocation,
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

describe("ReviewPage", () => {
  describe("general tests", () => {
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

    test("renders a title and description", () => {
      expect(
        screen.getByText("Step 5 of 5: Confirm your information")
      ).toBeInTheDocument();
    });
    test("defaults to EBranch if no home library is selected", () => {
      expect(screen.getByText("E-Branch")).toBeInTheDocument();
    });
  });

  describe("redirects", () => {
    test("redirects if user has already logged in", () => {
      render(
        <TestProviderWrapper>
          <ReviewPage hasUserAlreadyRegistered={true} />
        </TestProviderWrapper>
      );
      setTimeout(() => expect(router.push).toHaveBeenCalled(), 50);
    });
  });
});
