import React from "react";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ConfirmationContainer from ".";
import {
  FormResults,
  FormInputData,
  AddressesResponse,
} from "../../interfaces";
import { FormDataContextProvider } from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  pin: "1234",
  temporary: false,
  message: "The library card will be a standard library card.",
  patronId: 1234567,
  name: "Tom Nook",
};
const formState = {
  results: formResults,
  errorObj: undefined,
  csrfToken: "",
  formValues: {} as FormInputData,
  addressesResponse: {} as AddressesResponse,
  query: {},
};

describe("Confirmation", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <FormDataContextProvider initState={formState}>
        <ConfirmationContainer />
      </FormDataContextProvider>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders the NYPL card info", () => {
    render(
      <FormDataContextProvider initState={formState}>
        <ConfirmationContainer />
      </FormDataContextProvider>
    );

    expect(screen.getByText("MEMBER NAME")).toBeInTheDocument();
    expect(screen.getByText("Tom Nook")).toBeInTheDocument();

    expect(screen.getByText("12345678912345")).toBeInTheDocument();

    expect(screen.getByText("PIN")).toBeInTheDocument();
    expect(screen.getByText("1234")).toBeInTheDocument();

    expect(screen.getByText("ISSUED")).toBeInTheDocument();
  });
});
