import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import LibraryListFormFields from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";
import { LibraryListObject } from "../../interfaces";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      title: "Step 4 of 5: Customize Your Account",
      username: {
        label: "Username",
        instruction: "5-25 alphanumeric characters. No special characters.",
        checkButton: "Check if username is available",
      },
      password: {
        label: "Password",
        instruction:
          "We encourage you to select a strong password that includes: at least 8 characters, a mixture of uppercase and lowercase letters, a mixture of letters and numbers, and at least one special character <i>except</i> period (.) <br />Example: MyLib1731@<br />Password cannot contain common patterns such as consecutively repeating a character three or more times, e.g. aaaatf54 or repeating a pattern, e.g. abcabcab",
      },
      verifyPassword: {
        label: "Verify Password",
        instruction: "8-32 characters",
      },
      showPassword: "Show Password",
      selectLibrary: "Select a home library:",
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
        text:
          " By submitting an application, you understand and agree to our <a href='https://www.nypl.org/help/library-card/terms-conditions'>Cardholder Terms and Conditions</a> and agree to our <a href='https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations'>Rules and Regulations</a>. To learn more about the Library’s use of personal information, please read our <a href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'>Privacy Policy</a>.",
      },
      errorMessage: {
        username: "Username must be between 5-25 alphanumeric characters.",
        password:
          "Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)",
        verifyPassword: "The two passwords don't match.",
        acceptTerms: "The Terms and Conditions must be checked.",
      },
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str) => {
        let value = "";
        // Split the string value, such as "account.username.label".
        const keys = str.split(".");
        // The first one we want is from the `en` object.
        value = en[keys[0]];
        // Then any object after that must be from the `value`
        // object as we dig deeper.
        keys.forEach((k, index) => {
          if (index !== 0) {
            value = value[k];
          }
        });

        return value;
      },
    }),
  };
});
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { lang: "en" },
      asPath: "",
    };
  },
}));

const libraryList: LibraryListObject[] = [
  { value: "eb", label: "SimplyE" },
  { value: "sasb", label: "Schwarzman" },
  { value: "schomburg", label: "Schomburg" },
];

describe("LibraryListFormFields", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a label, input, and description", () => {
    render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );

    expect(screen.getByLabelText("Select a home library:")).toBeInTheDocument();
    // "textbox" is the role for the input element.
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("it updates the selected value from the dropdown", async () => {
    render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );

    const input = screen.getByRole("textbox");

    // Default input value:
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Schwarzman" } })
    );
    input.focus();

    // Instead of `getByDisplayValue`, we want to `getByText` since this the
    // suggestions are rendered in a list element.
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Schomburg" } })
    );
    input.focus();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
  });

  test("it shows the suggestions", async () => {
    render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );

    const input = screen.getByRole("textbox");

    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () => fireEvent.change(input, { target: { value: "S" } }));
    input.focus();

    // All suggestions start with "S" so we expect all to show up.
    expect(screen.getByText("SimplyE")).toBeInTheDocument();
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Sch" } })
    );
    input.focus();

    // But now we search by "Sch" so only two should display.
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();
  });
});
