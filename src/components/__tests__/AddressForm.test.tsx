import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import AddressForm, { AddressTypes } from "../AddressForm";
import { TestProviderWrapper } from "../../../testHelper/utils";
import { Address } from "../../interfaces";

expect.extend(toHaveNoViolations);

const addressErrorMessages: Address = {
  line1: "Please enter a valid street address.",
  city: "Please enter a valid city.",
  state: "Please enter a 2-character state abbreviation.",
  zip: "Please enter a 5 or 9-digit postal code.",
};
// The `errors` object shape from `react-hook-form`.
const reactHookFormErrors = {
  "home-line1": { message: addressErrorMessages.line1 },
  "home-city": { message: addressErrorMessages.city },
  "home-state": { message: addressErrorMessages.state },
  "home-zip": { message: addressErrorMessages.zip },
};

describe("AddressForm", () => {
  test("it passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AddressForm
          type={AddressTypes.Home}
          errorMessages={addressErrorMessages}
        />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it passess accessibilty checks with error messages", async () => {
    const { container } = render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AddressForm
          type={AddressTypes.Home}
          errorMessages={addressErrorMessages}
        />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("it should render five fields", () => {
    render(
      <TestProviderWrapper>
        <AddressForm
          type={AddressTypes.Home}
          errorMessages={addressErrorMessages}
        />
      </TestProviderWrapper>
    );

    // Unfortunately, getByLabelText doesn't work for these label since the
    // label text is broken up by different elements, e.g. the "Required" text
    // is in a separate element inside the <label> element. But, getByRole
    // works just as well.
    const line1 = screen.getByRole("textbox", {
      name: "Street Address Required",
    });
    const line2 = screen.getByLabelText("Apartment / Suite");
    const city = screen.getByRole("textbox", { name: "City Required" });
    const state = screen.getByRole("textbox", { name: "State Required" });
    const zip = screen.getByRole("textbox", { name: "Postal Code Required" });

    expect(line1).toBeInTheDocument();
    expect(line2).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(state).toBeInTheDocument();
    expect(zip).toBeInTheDocument();
  });

  test("it should render five optional fields for the work address", () => {
    render(
      <TestProviderWrapper>
        <AddressForm
          type={AddressTypes.Work}
          errorMessages={addressErrorMessages}
        />
      </TestProviderWrapper>
    );

    // Since none of the fields are required for the work address, we can
    // use the getByLabelText function.
    const line1 = screen.getByLabelText("Street Address");
    const line2 = screen.getByLabelText("Apartment / Suite");
    const city = screen.getByLabelText("City");
    const state = screen.getByLabelText("State");
    const zip = screen.getByLabelText("Postal Code");

    expect(line1).toBeInTheDocument();
    expect(line2).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(state).toBeInTheDocument();
    expect(zip).toBeInTheDocument();
  });

  test("it should render any error messages for required fields", () => {
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AddressForm
          type={AddressTypes.Home}
          errorMessages={addressErrorMessages}
        />
      </TestProviderWrapper>
    );

    const line1Error = screen.getByText(
      reactHookFormErrors["home-line1"].message
    );
    const cityError = screen.getByText(
      reactHookFormErrors["home-city"].message
    );
    const stateError = screen.getByText(
      reactHookFormErrors["home-state"].message
    );
    const zipError = screen.getByText(reactHookFormErrors["home-zip"].message);

    expect(line1Error).toBeInTheDocument();
    expect(cityError).toBeInTheDocument();
    expect(stateError).toBeInTheDocument();
    expect(zipError).toBeInTheDocument();
  });
});
