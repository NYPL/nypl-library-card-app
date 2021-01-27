import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import ApplicationContainer from ".";

describe.skip("ApplicationContainer", () => {
  test("passes axe accessibility test", async () => {
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
