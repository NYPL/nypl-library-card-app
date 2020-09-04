/* eslint-disable */
import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AddressPage from "../pages/library-card/address";
import { TestProviderWrapper } from "../testHelper/utils";
import { formInitialState } from "../src/context/FormDataContext";

expect.extend(toHaveNoViolations);

describe("AddressPage accessibility", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AddressPage />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AddressPage", () => {
  test("renders a title and decription", () => {
    render(
      <TestProviderWrapper>
        <AddressPage />
      </TestProviderWrapper>
    );
    expect(screen.getByText("Confirm your Address")).toBeInTheDocument();
  });

  test("renders a home address", async () => {
    const initState = {
      ...formInitialState,
      addressResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          message: "",
          reason: "",
        },
        work: {},
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressPage />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY")).toBeInTheDocument();
    expect(screen.getByText("11377")).toBeInTheDocument();
  });

  test("renders multiple home addresses", async () => {
    const initState = {
      ...formInitialState,
      addressResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: [
            {
              line1: "1234 61st",
              city: "Woodside",
              state: "NY",
              zip: "11377",
            },
            {
              line1: "5678 61st",
              city: "Woodside",
              state: "NY",
              zip: "11388",
            },
          ],
          message: "",
          reason: "",
        },
        work: {},
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressPage />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We have found an alternate home address. Please choose which is correct:"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();
  });

  test("renders an optional work address", async () => {
    const initState = {
      ...formInitialState,
      addressResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          message: "",
          reason: "",
        },
        work: {
          cardType: "standard",
          address: {
            line1: "476 5th Ave",
            city: "New York",
            state: "NY",
            zip: "10018",
          },
          addresses: undefined,
          message: "",
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressPage />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY")).toBeInTheDocument();
    expect(screen.getByText("11377")).toBeInTheDocument();

    expect(screen.getByText("Work Address")).toBeInTheDocument();
    expect(screen.getByText("476 5th Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY")).toBeInTheDocument();
    expect(screen.getByText("10018")).toBeInTheDocument();
  });

  test("renders multiple optional work addresses", async () => {
    const initState = {
      ...formInitialState,
      addressResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: [
            {
              line1: "1234 61st",
              city: "Woodside",
              state: "NY",
              zip: "11377",
            },
            {
              line1: "5678 61st",
              city: "Woodside",
              state: "NY",
              zip: "11388",
            },
          ],
          message: "",
          reason: "",
        },
        work: {
          cardType: "standard",
          address: {
            line1: "476 5th Ave",
            city: "New York",
            state: "NY",
            zip: "10018",
          },
          addresses: [
            {
              line1: "476 5th Ave",
              city: "New York",
              state: "NY",
              zip: "10018",
            },
            {
              line1: "1111 1st Ave",
              city: "New York",
              state: "NY",
              zip: "10001",
            },
          ],
          message: "",
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressPage />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Home Address")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We have found an alternate home address. Please choose which is correct:"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();

    expect(screen.getByText("Work Address")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We have found an alternate work address. Please choose which is correct:"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10018")).toBeInTheDocument();

    expect(screen.getByText("1111 1st Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
  });
});
