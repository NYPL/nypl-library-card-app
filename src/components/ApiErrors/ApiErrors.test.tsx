import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import ApiErrors from ".";
import { errorMessages } from "../../utils/formDataUtils";
import { mockTFunction } from "../../../testHelper/utils";

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
      status: 400,
      type: "",
      title: "",
      detail: "",
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
      status: 400,
      type: "unexpected-type",
      title: "unexpected type",
      detail: "uhoh",
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
    const pd = {
      status: 500,
      type: "ils-integration-error",
      title: "ILS Integration Error",
      detail: "There was an error with the ILS.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("There was an error with the ILS.")
    ).toBeInTheDocument();
  });

  test("it renders a missing required values detail", () => {
    const pd = {
      status: 500,
      type: "missing-required-values",
      title: "Missing Required Values",
      detail: "'firsName' and 'password' are missing",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("'firsName' and 'password' are missing")
    ).toBeInTheDocument();
  });

  test("it renders an unavailable username detail", () => {
    const pd = {
      status: 400,
      type: "unavailable-username",
      title: "Unavailable Username",
      detail: "username is unavailable. Please try another.",
    };

    render(<ApiErrors problemDetail={pd} />);
    expect(
      screen.getByText("is unavailable. Please try another.")
    ).toBeInTheDocument();
  });

  test("it renders multiple errors for invalid requests", () => {
    const pd = {
      status: 400,
      type: "invalid-request",
      title: "Invalid Request",
      detail: "There was a problem with the submission",
      error: {
        username: errorMessages.username,
        password: errorMessages.password,
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
