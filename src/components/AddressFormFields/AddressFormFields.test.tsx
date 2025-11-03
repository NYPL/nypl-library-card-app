import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressFormFields from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import { Address, AddressTypes } from "../../interfaces";

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

jest.mock("react-i18next", () => {
  const en = {
    location: {
      address: {
        title: "Home Address",
        description:
          "If you live in NYC, please fill out the home address form.",
        line1: { label: "Street Address" },
        line2: { label: "Apartment / Suite" },
        city: { label: "City" },
        state: { label: "State", instruction: "2-letter abbreviation" },
        postalCode: {
          label: "Postal Code",
          instruction: "5 or 9-digit postal code",
        },
      },
      workAddress: {
        title: "Alternate Address",
        description: {
          part1:
            "The application process is slightly different depending on whether you live, work, go to school, or pay property taxes in New York City, elsewhere in New York State, or elsewhere in the United States and you&apos;re just visiting New York City. Please select one of the following and fill out the required fields.",
          part2:
            "If you work or go to school in NYC please provide the address.",
        },
      },
      errorMessage: {
        line1: "There was a problem. Please enter a valid street address.",
        city: "There was a problem. Please enter a valid city.",
        state:
          "There was a problem. Please enter a 2-character state abbreviation.",
        zip: "There was a problem. Please enter a 5 or 9-digit postal code.",
      },
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

describe("AddressFormFields", () => {
  test("it passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AddressFormFields id="address-test" type={AddressTypes.Home} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("it passes accessibilty checks with error messages", async () => {
    const { container } = render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AddressFormFields id="address-test" type={AddressTypes.Home} />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("it should render five fields", () => {
    render(
      <TestProviderWrapper>
        <AddressFormFields id="address-test" type={AddressTypes.Home} />
      </TestProviderWrapper>
    );

    // Unfortunately, getByLabelText doesn't work for these label since the
    // label text is broken up by different elements, e.g. the "Required" text
    // is in a separate element inside the <label> element. But, getByRole
    // works just as well.
    const line1 = screen.getByRole("textbox", {
      name: "Street Address (required)",
    });
    const line2 = screen.getByLabelText("Apartment / Suite");
    const city = screen.getByRole("textbox", { name: "City (required)" });
    const state = screen.getByRole("textbox", { name: "State (required)" });
    const zip = screen.getByRole("textbox", { name: "Postal Code (required)" });

    expect(line1).toBeInTheDocument();
    expect(line2).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(state).toBeInTheDocument();
    expect(zip).toBeInTheDocument();
  });

  test("it should render five optional fields for the work address", () => {
    render(
      <TestProviderWrapper>
        <AddressFormFields id="address-test" type={AddressTypes.Work} />
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

  test.skip("it should render any error messages for required fields", () => {
    render(
      <TestProviderWrapper hookFormState={{ errors: reactHookFormErrors }}>
        <AddressFormFields id="address-test" type={AddressTypes.Home} />
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
