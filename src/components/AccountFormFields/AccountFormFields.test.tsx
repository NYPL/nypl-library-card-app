import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import AccountFormFields from ".";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      title: "Step 4 of 5: Customize Your Account",
      description:
        "Create a username and password so you can log in and manage your account or access an array of our digital resources. Your username should be unique.",
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
      library: {
        selectLibrary: "Select a home library:",
        placeholder: "Type a library name, such as Parkchester Library",
        title: "Home Library",
        description: {
          part1:
            "Choosing a home library will help us make sure you&apos;re getting everything you need from a branch that&apos;s most convenient for you.",
          part2:
            "You can skip this step and update it at any point through your account.",
        },
      },
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
        text:
          "By submitting an application, you understand and agree to our <a href='https://www.nypl.org/help/library-card/terms-conditions'>Cardholder Terms and Conditions</a> and agree to our <a href='https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations'>Rules and Regulations</a>. To learn more about the Library’s use of personal information, please read our <a href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'>Privacy Policy</a>.",
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
      t: mockTFunction(en),
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

describe("AccountFormFields accessibility check", () => {
  test("passes axe accessibility test", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <AccountFormFields id="accountFormFields-test" />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("AccountFormFields", () => {
  let container;
  beforeEach(() => {
    const utils = render(
      <TestProviderWrapper>
        <AccountFormFields id="accountFormFields-test" />
      </TestProviderWrapper>
    );
    container = utils.container;
  });

  test("renders username, password, verify password, and checkbox fields", () => {
    expect(
      screen.getByRole("textbox", { name: "Username (Required)" })
    ).toBeInTheDocument();
    // Password input types don't have roles so `getByRole` doesn't work.
    // `getByLabelText(/Password/i)` is too generic and gets both instances and
    // `getByLabelText(/Password Required/i)` doesn't find anything.
    expect(
      container.querySelector("input[type='password']")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Verify Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Show Password" })
    ).toBeInTheDocument();
  });

  test("renders username, password, verify password, and checkbox fields", async () => {
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;

    // Unchecked by default.
    // By default, the password and verify password fields are "password" types.
    expect(checkbox.checked).toEqual(false);
    expect(
      container.querySelector("input[type='password']")
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Verify Password/i)).toBeInTheDocument();

    await act(async () => await fireEvent.click(checkbox));

    // But once the checkbox is checked, the password fields before text fields
    // so that users can see their values.
    expect(checkbox.checked).toEqual(true);
    expect(
      container.querySelector("input[type='password']")
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Password (Required)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Verify Password (Required)" })
    ).toBeInTheDocument();
  });

  test("renders the autosuggest dropdown", () => {
    expect(screen.getByText("Home Library")).toBeInTheDocument();
    expect(screen.getByLabelText("Select a home library:")).toBeInTheDocument();
  });
});
