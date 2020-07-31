/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";

import ApplicationContainer from "../ApplicationContainer";

expect.extend(toHaveNoViolations);

describe("ApplicationContainer", () => {
  test("passes axe", async () => {
    const { container } = render(<ApplicationContainer />);

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders with a header and footer", () => {
    const { container } = render(<ApplicationContainer />);

    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
  });

  test("renders a banner", () => {
    render(<ApplicationContainer />);

    expect(screen.getByText("GET A LIBRARY CARD")).toBeInTheDocument();
  });

  test("renders its child prop", () => {
    const child = <p>I am the child component</p>;

    render(<ApplicationContainer>{child}</ApplicationContainer>);

    expect(screen.getByText("I am the child component")).toBeInTheDocument();
  });
});
