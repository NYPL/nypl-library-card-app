import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import RoutingLinks from "./index";

describe("RoutingLinks", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <RoutingLinks
          previous={{ url: "/previous", text: "Previous" }}
          next={{ url: "/next", text: "Next" }}
        />
      );

      expect(await axe(container)).toHaveNoViolations();
    });
  });

  test("only renders a 'next' link, 'previous' link is optional", () => {
    render(<RoutingLinks next={{ url: "/next", text: "Next" }} />);
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  test("renders two links when both 'previous' and 'next' props are passed", () => {
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

  test("has default values for the two link's text", () => {
    render(
      <RoutingLinks previous={{ url: "/previous" }} next={{ url: "/next" }} />
    );

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
