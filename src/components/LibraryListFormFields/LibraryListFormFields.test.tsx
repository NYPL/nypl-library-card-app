import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import LibraryListFormFields from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import { LibraryListObject } from "../../interfaces";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      title: "Step 4 of 5: Customize your account",
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
        label: "Verify password",
        instruction: "8-32 characters",
      },
      showPassword: "Show password",
      library: {
        selectLibrary: "Select a home library:",
        placeholder: "Type a library name, such as Parkchester Library",
        title: "Home library",
        description: {
          part1:
            "Choosing a home library will help us make sure you&apos;re getting everything you need from a branch that&apos;s most convenient for you.",
          part2:
            "You can skip this step and update it at any point through your account.",
        },
      },
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
        text: "By submitting an application, you understand and agree to our <a href='https://www.nypl.org/help/library-card/terms-conditions'>Cardholder Terms and Conditions</a> and agree to our <a href='https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations'>Rules and Regulations</a>. To learn more about the Library’s use of personal information, please read our <a href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'>Privacy Policy</a>.",
      },
      errorMessage: {
        username:
          "There was a problem. Username must be between 5-25 alphanumeric characters.",
        password:
          "There was a problem. Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)",
        verifyPassword: "There was a problem. The two passwords don't match.",
        acceptTerms:
          "There was a problem. The Terms and Conditions must be checked.",
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

const libraryList: LibraryListObject[] = [
  { value: "vr", label: "Virtual" },
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

    expect(
      screen.getByLabelText("Select a home library: (required)")
    ).toBeInTheDocument();
    // "textbox" is the role for the input element.
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
