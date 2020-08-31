/* eslint-disable */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import LocationForm from "../LocationForm";
import { TestHookFormProvider } from "../../../testHelper/utils";
import {
  FormDataContextProvider,
  formInitialState,
} from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

describe("LocationForm", () => {
  const errorMessage = "Please select an address option.";
  const nyc = "New York City (All five boroughs)";
  const nys = "New York State (Outside NYC)";
  const us = "United States (Visiting NYC)";

  test("passes accessibility checks", async () => {
    const { container } = render(
      <FormDataContextProvider initState={formInitialState}>
        <LocationForm errorMessage={errorMessage} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders an alternate form link", () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LocationForm errorMessage={errorMessage} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    expect(screen.getByText("alternate form")).toBeInTheDocument();
  });

  test("renders three radio buttons", () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LocationForm errorMessage={errorMessage} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    expect(screen.getByLabelText(nyc)).toBeInTheDocument();
    expect(screen.getByLabelText(nys)).toBeInTheDocument();
    expect(screen.getByLabelText(us)).toBeInTheDocument();
  });

  test("updates the value selected", async () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LocationForm errorMessage={errorMessage} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    let radio = screen.getByLabelText(nyc) as HTMLInputElement;

    expect(radio.value).toBe("nyc");

    await fireEvent.change(radio, { target: { value: "nys" } });
    expect(radio.value).toBe("nys");

    await fireEvent.change(radio, { target: { value: "us" } });
    expect(radio.value).toBe("us");
  });

  test("renders an error message if there is one from react-hook-form", () => {
    const reactHookFormErrors = {
      location: {
        message: errorMessage,
      },
    };
    render(
      <FormDataContextProvider initState={formInitialState}>
        <TestHookFormProvider errors={reactHookFormErrors}>
          <LocationForm errorMessage={errorMessage} />
        </TestHookFormProvider>
      </FormDataContextProvider>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
