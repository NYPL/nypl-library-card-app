import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import ConfirmationContainer from ".";
import {
  FormResults,
  FormInputData,
  AddressesResponse,
} from "../../interfaces";
import { FormDataContextProvider } from "../../context/FormDataContext";
import { mockTFunction } from "../../../testHelper/utils";

const formResults: FormResults = {
  barcode: "12345678912345",
  username: "tomnook",
  password: "1234",
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

jest.mock("react-i18next", () => {
  const en = {
    confirmation: {
      title:
        "Congratulations! You now have a temporary digital New York Public Library card.",
      description: {
        part1:
          "Print or save this information for your records. Within 24 hours, you will receive an email with the details of your account.",
        part2:
          "To borrow physical materials, please visit one of our <a href='http://nypl.org/locations'>locations</a> with a valid <a href='https://www.nypl.org/help/library-card/terms-conditions#eligibility'>photo ID and proof of address</a> to complete the application for a physical card.",
        part3:
          "This is a temporary card and will expire in 14 days. If you are a student in a New York–accredited college, an employee at a NYC company but not physically in the city or state, or a researcher who will be visiting one of our research centers, contact <a href='mailto:gethelp@nypl.org'>gethelp@nypl.org</a> to update your card.",
      },
      graphic: {
        memberName: "MEMBER NAME",
        password: "PASSWORD",
        issued: "ISSUED",
      },
      nextSteps: {
        title: "Get started with The New York Public Library",
        exploreHeader: "Explore E-Books & E-Audiobooks",
        explore:
          "<a href='https://www.nypl.org/books-music-movies/help'>Read or listen on-the-go</a> with access to a wide array of titles.",
        borrowHeader: "Borrow books & more",
        borrow:
          "<a href='{{loginUrl}}'> Log into your account</a> and browse the catalog. To check out and borrow physical items, visit any <a href='https://www.nypl.org/locations'>NYPL location</a> to verify your information and receive a physical card.",
        updatesHeader: "Get updates",
        updates:
          "<a href='https://www.nypl.org/enews'>Find out about all the Library has to offer.</a>",
        moreHeader: "Learn more",
        more: "<a href='https://www.nypl.org/discover-library-card'>Discover everything you can do with your library card.</a>",
      },
    },
    ariaLabel: {
      librarySuggestions: "List of library name suggestions",
      barcode: "Scannable barcode",
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

describe("Confirmation", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <FormDataContextProvider initState={formState}>
          <ConfirmationContainer />
        </FormDataContextProvider>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
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

    expect(screen.getByText("ISSUED")).toBeInTheDocument();
  });
});
