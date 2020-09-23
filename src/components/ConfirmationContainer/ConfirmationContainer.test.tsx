/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ConfirmationContainer from ".";
import { FormResults } from "../../interfaces";

expect.extend(toHaveNoViolations);

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  pin: "1234",
  temporary: false,
  message: "The library card will be a standard library card.",
  patronId: 1234567,
  name: "Tom Nook",
};

describe("Confirmation", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(<ConfirmationContainer />);

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders with the basic form submission result displaying", () => {
    render(<ConfirmationContainer />);

    expect(
      screen.getByText("Thank you for submitting your application.")
    ).toBeInTheDocument();
    expect(screen.getByText("username: tomnook")).toBeInTheDocument();
    expect(screen.getByText("temporary: false")).toBeInTheDocument();
    expect(
      screen.getByText(
        "message: The library card will be a standard library card."
      )
    ).toBeInTheDocument();
  });

  test("renders the NYPL card info", () => {
    render(<ConfirmationContainer />);

    expect(screen.getByText("MEMBER NAME")).toBeInTheDocument();
    expect(screen.getByText("Tom Nook")).toBeInTheDocument();

    expect(screen.getByText("12345678912345")).toBeInTheDocument();

    expect(screen.getByText("PIN")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();

    expect(screen.getByText("ISSUED")).toBeInTheDocument();
  });
});
