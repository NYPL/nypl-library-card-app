import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AddressForm, {
  AddressTypes,
  AddressErrors,
} from "../src/components/AddressForm";

describe("AddressForm", () => {
  const mockRegister = jest.fn();
  const errors = {};
  const addressErrorMessages: AddressErrors = {
    line1: "Please enter a valid street address.",
    city: "Please enter a valid city.",
    state: "Please enter a 2-character state abbreviation.",
    zip: "Please enter a 5-digit postal code.",
  };

  test("it should render five fields", () => {
    render(
      <AddressForm
        type={AddressTypes.Home}
        register={mockRegister}
        errors={errors}
        errorMessages={addressErrorMessages}
      />
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
      <AddressForm
        type={AddressTypes.Work}
        register={mockRegister}
        errors={errors}
        errorMessages={addressErrorMessages}
      />
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
    // The `errors` object shape from `react-hook-form`.
    const errors = {
      "home-line1": {
        message: "Please enter a valid street address.",
      },
      "home-city": {
        message: "Please enter a valid city.",
      },
      "home-state": {
        message: "Please enter a 2-character state abbreviation.",
      },
      "home-zip": {
        message: "Please enter a 5-digit postal code.",
      },
    };

    render(
      <AddressForm
        type={AddressTypes.Home}
        register={mockRegister}
        errors={errors}
        errorMessages={addressErrorMessages}
      />
    );

    const line1Error = screen.getByText(errors["home-line1"].message);
    const cityError = screen.getByText(errors["home-city"].message);
    const stateError = screen.getByText(errors["home-state"].message);
    const zipError = screen.getByText(errors["home-zip"].message);

    expect(line1Error).toBeInTheDocument();
    expect(cityError).toBeInTheDocument();
    expect(stateError).toBeInTheDocument();
    expect(zipError).toBeInTheDocument();
  });
});
