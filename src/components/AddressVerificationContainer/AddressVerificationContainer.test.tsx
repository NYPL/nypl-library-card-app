import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressVerificationContainer from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";
import { formInitialState } from "../../context/FormDataContext";
import { AddressResponse } from "../../interfaces";

describe("AddressVerificationContainer accessibility", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressVerificationContainer />
        </TestProviderWrapper>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("AddressVerificationContainer", () => {
  test("renders a home address", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          detail: "",
          reason: "",
          success: true,
        },
        work: {} as AddressResponse,
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();
  });

  test("renders multiple home addresses", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
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
          detail: "",
          reason: "",
          success: true,
        },
        work: {} as AddressResponse,
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();
  });

  test("renders an optional work address", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          detail: "",
          success: true,
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
          detail: "",
          success: true,
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("476 5th Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10018")).toBeInTheDocument();
  });

  test("renders multiple optional work addresses", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
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
          detail: "",
          success: true,
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
          detail: "",
          success: true,
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();
    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();

    expect(screen.getByText("New York, NY 10018")).toBeInTheDocument();
    expect(screen.getByText("1111 1st Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
  });
});
