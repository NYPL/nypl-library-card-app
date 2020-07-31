/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";

import Confirmation from "../Confirmation";
import { FormResults } from "../../interfaces";

expect.extend(toHaveNoViolations);

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  pin: "1234",
  temporary: false,
  message: "The library card will be a standard library card.",
  patronId: 1234567,
};

describe("Confirmation", () => {
  test("passes axe", async () => {
    const { container } = render(<Confirmation formResults={formResults} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders with the basic form submission result displaying", () => {
    render(<Confirmation formResults={formResults} />);

    expect(
      screen.getByText("Thank you for submitting your application.")
    ).toBeInTheDocument();
    expect(screen.getByText("barcode: 12345678912345")).toBeInTheDocument();
    expect(screen.getByText("username: tomnook")).toBeInTheDocument();
    expect(screen.getByText("pin: 1234")).toBeInTheDocument();
    expect(screen.getByText("temporary: false")).toBeInTheDocument();
    expect(screen.getByText("id: 1234567")).toBeInTheDocument();
    expect(
      screen.getByText(
        "message: The library card will be a standard library card."
      )
    ).toBeInTheDocument();
  });
});
