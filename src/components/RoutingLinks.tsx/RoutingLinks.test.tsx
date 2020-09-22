/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import RoutingLinks from "./index";

expect.extend(toHaveNoViolations);

describe("RoutingLinks", () => {
  it("passes axe accessibility test", async () => {
    const { container } = render(
      <RoutingLinks
        previous={{ url: "/previous", text: "Previous" }}
        next={{ url: "/next", text: "Next" }}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("only renders a 'next' link, 'previous' link is optional", () => {
    render(<RoutingLinks next={{ url: "/next", text: "Next" }} />);
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders two links when both 'previous' and 'next' props are passed", () => {
    render(
      <RoutingLinks
        previous={{ url: "/previous", text: "Previous" }}
        next={{ url: "/next", text: "Next" }}
      />
    );

    expect(screen.getAllByRole("link").length).toEqual(2);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("has default values for the two link's text", () => {
    render(
      <RoutingLinks previous={{ url: "/previous" }} next={{ url: "/next" }} />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
