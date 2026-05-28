import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ApiErrors from ".";
import { errorMessages } from "../../utils/formDataUtils";
import { mockTFunction } from "../../../testHelper/utils";
import { ApiErrorResponse } from "../../errors";

jest.mock("react-i18next", () => {
  const en = {
    globalErrors: {
      title: "Form submission error",
      defaultError:
        "There was an error processing your submission. Please try again later.",
    },
    apiErrors: {
      defaultError: "There were errors with your submission.",
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

describe("ApiErrors", () => {
  test("it passes axe accessibility test", async () => {
    const { container } = render(<ApiErrors problemDetail={undefined} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it renders the generic message if there is no type in the problem detail", () => {
    const pd = {
      success: false as const,
      status: 400,
      type: "" as ApiErrorResponse["type"],
      message: "",
    };

    render(<ApiErrors problemDetail={pd} />);

    expect(screen.getByText("Form submission error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "There was an error processing your submission. Please try again later."
      )
    ).toBeInTheDocument();
  });

  test("it renders the generic message if the type isn't found", () => {
    const pd = {
      success: false as const,
      status: 400,
      type: "unexpected-type" as ApiErrorResponse["type"],
      message: "uhoh",
    };

    render(<ApiErrors problemDetail={pd} />);

    expect(screen.getByText("Form submission error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "There was an error processing your submission. Please try again later."
      )
    ).toBeInTheDocument();
  });

  test("it renders an ILS integration detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 500,
      type: "ils-integration-error",
      message: "There was an error with the ILS.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("There was an error with the ILS.")
    ).toBeInTheDocument();
  });

  test("it renders a missing required fields detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 500,
      type: "missing-required-fields",
      message: "'firsName' and 'password' are missing",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("'firsName' and 'password' are missing")
    ).toBeInTheDocument();
  });

  test("it renders a patron creation failed detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 500,
      type: "patron-creation-failed",
      message: "The patron could not be created.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("The patron could not be created.")
    ).toBeInTheDocument();
  });

  test("it renders a platform API error detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 502,
      type: "platform-api-error",
      message: "The service is currently unavailable. Please try again.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText(
        "The service is currently unavailable. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("it renders a platform API timeout detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 504,
      type: "platform-api-timeout",
      message: "The request timed out. Please try again.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("The request timed out. Please try again.")
    ).toBeInTheDocument();
  });

  test("it renders an address validation failed detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 400,
      type: "address-validation-failed",
      message: "The address could not be validated.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("The address could not be validated.")
    ).toBeInTheDocument();
  });

  test("it renders a CSRF invalid detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 403,
      type: "csrf-invalid",
      message: "A server error occurred validating a token.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("A server error occurred validating a token.")
    ).toBeInTheDocument();
  });

  test("it renders an unavailable username detail", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 400,
      type: "username-unavailable",
      message: "username is unavailable. Please try another.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("is unavailable. Please try another.")
    ).toBeInTheDocument();
  });

  test("it renders multiple errors for invalid requests", () => {
    const pd: ApiErrorResponse = {
      success: false,
      status: 400,
      type: "invalid-request",
      message: "There was a problem with the submission",
      details: {
        fields: {
          username: errorMessages.username,
          password: errorMessages.password,
        },
      },
    };

    render(<ApiErrors problemDetail={pd} />);

    // Text is broken up by the anchor elements so only checking for the text:
    expect(
      screen.getByText(/must be between 5-25 alphanumeric characters./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/must be at least 8 characters/)
    ).toBeInTheDocument();
  });
});
