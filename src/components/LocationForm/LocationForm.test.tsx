/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import LocationForm from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";

expect.extend(toHaveNoViolations);

describe("LocationForm", () => {
  const errorMessage = "Please select an address option.";
  const nyc = "New York City (All five boroughs)";
  const nys = "New York State (Outside NYC)";
  const us = "United States (Visiting NYC)";

  const inputRadioList = [
    {
      value: "nyc",
      label: nyc,
      ref: () => {},
      addressFields: <div>Some fields</div>,
    },
    {
      value: "nys",
      label: nys,
      ref: () => {},
      addressFields: <div>Some fields</div>,
    },
    {
      value: "us",
      label: us,
      ref: () => {},
      addressFields: <div>Some fields</div>,
    },
  ];

  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <LocationForm inputRadioList={inputRadioList} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders three radio buttons", () => {
    render(
      <TestProviderWrapper>
        <LocationForm inputRadioList={inputRadioList} />
      </TestProviderWrapper>
    );

    expect(screen.getByLabelText(nyc)).toBeInTheDocument();
    expect(screen.getByLabelText(nys)).toBeInTheDocument();
    expect(screen.getByLabelText(us)).toBeInTheDocument();
  });

  test("updates the value selected", async () => {
    render(
      <TestProviderWrapper>
        <LocationForm inputRadioList={inputRadioList} />
      </TestProviderWrapper>
    );

    const radionyc = screen.getByLabelText(nyc, {
      selector: "input",
    }) as HTMLInputElement;
    const radionys = screen.getByLabelText(nys, {
      selector: "input",
    }) as HTMLInputElement;
    const radious = screen.getByLabelText(us, {
      selector: "input",
    }) as HTMLInputElement;
    expect(radionyc).not.toBeChecked();
    expect(radionys).not.toBeChecked();
    expect(radious).not.toBeChecked();

    await fireEvent.click(radionys);

    expect(radionyc).not.toBeChecked();
    expect(radionys).toBeChecked();
    expect(radious).not.toBeChecked();

    await fireEvent.click(radious);
    expect(radionyc).not.toBeChecked();
    expect(radionys).not.toBeChecked();
    expect(radious).toBeChecked();
  });

  test("renders an error message if there is one from react-hook-form", () => {
    const reactHookFormErrors = {
      location: {
        message: errorMessage,
      },
    };
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <LocationForm inputRadioList={inputRadioList} />
      </TestProviderWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("it sets the default value from the IP geolocation API", () => {
    const userLocation = {
      inNYCity: false,
      inNYState: true,
      inUS: true,
    };
    render(
      <TestProviderWrapper userLocation={userLocation}>
        <LocationForm inputRadioList={inputRadioList} />
      </TestProviderWrapper>
    );

    const radionyc = screen.getByLabelText(nyc, {
      selector: "input",
    }) as HTMLInputElement;
    const radionys = screen.getByLabelText(nys, {
      selector: "input",
    }) as HTMLInputElement;
    const radious = screen.getByLabelText(us, {
      selector: "input",
    }) as HTMLInputElement;
    expect(radionyc).not.toBeChecked();
    expect(radionys).toBeChecked();
    expect(radious).not.toBeChecked();
  });
});
