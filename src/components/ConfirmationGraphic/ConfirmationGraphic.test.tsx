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
  formValues: {} as FormInputData,
  addressesResponse: {} as AddressesResponse,
  query: {},
};

jest.mock("react-i18next", () => {
  const en = {
    confirmation: {
      title:
        "Congratulations! You now have a digital New York Public Library card.",
      description: {
        part1:
          "Print or save this information for your records. Within 24 hours, you will receive an email with the details of your account.",
        part2:
          "To borrow physical materials, please visit one of our <a href='http://nypl.org/locations'>locations</a> with a valid <a href='https://www.nypl.org/help/library-card/terms-conditions#Eligibility'>photo ID and proof of address</a> to complete the application for a physical card.",
        part3:
          "This is a temporary card and will expire in 14 days. If you are a student in a New York–accredited college, an employee at a NYC company but not physically in the city or state, or a researcher who will be visiting one of our research centers, contact <a href='mailto:gethelp@nypl.org'>gethelp@nypl.org</a> to update your card.",
      },
      graphic: {
        memberName: "MEMBER NAME",
        password: "PASSWORD",
        issued: "ISSUED",
      },
      nextSteps: {
        title: "Get Started with The New York Public Library",
        explore:
          "<b>Explore Library E-Books</b><br />Download SimplyE for <a href='https://apps.apple.com/app/apple-store/id1046583900'>iOS</a> or <a href='https://play.google.com/store/apps/details?id=org.nypl.simplified.simplye&referrer=utm_source%3Dnypl.org%26utm_medium%3Dreferral%26utm_content%3Dnypl_website_simplye2%26utm_campaign%3Dnypl_website_simplye2'>Android</a>.",
        borrow:
          "<b>Borrow Books & More</b><br /><a href='https://ilsstaff.nypl.org/iii/cas/login?service=http%3A%2F%2Fauth.nypl.org%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3Dapp_myaccount%26scope%3Dopenid%2Boffline_access%2Bpatron%253Aread%26redirect_uri%3Dhttps%253A%252F%252Flogin.nypl.org%252Fauth%252Flogin%26state%3DeyJyZWRpcmVjdF91cmkiOiJodHRwczpcL1wvYnJvd3NlLm55cGwub3JnXC9paWlcL2VuY29yZVwvbXlhY2NvdW50In0%253D'> Log into your account</a> and browse the catalog.",
        updates:
          "<b>Get Updates</b><br /><a href='https://www.nypl.org/enews'>Find out about all the Library has to offer.</a>",
        more:
          "<b>Learn More</b><br /><a href='https://www.nypl.org/discover-library-card'>Discover everything you can do with your library card.</a>",
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
