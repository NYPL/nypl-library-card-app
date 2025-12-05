import { Page, Locator } from "@playwright/test";
import {
  USERNAME_AVAILABLE_MESSAGE,
  USERNAME_UNAVAILABLE_MESSAGE,
} from "../utils/constants";

export class ReviewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly personalInfoHeading: Locator;
  readonly firstNameHeading: Locator;
  readonly lastNameHeading: Locator;
  readonly dateOfBirthHeading: Locator;
  readonly emailHeading: Locator;
  readonly receiveInfoHeading: Locator;
  readonly addressHeading: Locator;
  readonly streetHeading: Locator;
  readonly cityHeading: Locator;
  readonly stateHeading: Locator;
  readonly postalCodeHeading: Locator;
  readonly addressEditButton: Locator;
  readonly editPersonalInfoButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emailInput: Locator;
  readonly receiveInfoChoice: Locator;
  readonly receiveInfoCheckbox: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;
  readonly createYourAccountHeading: Locator;
  readonly usernameHeading: Locator;
  readonly showPasswordCheckbox: Locator;
  readonly passwordHeading: Locator;
  readonly homeLibraryHeading: Locator;
  readonly defaultHomeLibrary: Locator;
  readonly accountEditButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly verifyPasswordInput: Locator;
  readonly availableUsernameButton: Locator;
  readonly availableUsernameMessage: Locator;
  readonly unavailableUsernameError: Locator;
  readonly homeLibraryDropdown: Locator;
  readonly cardholderTermsLink: Locator;
  readonly rulesRegulationsLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly submitButton: Locator;
  readonly formSubmissionUserNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Step 5 of 5: Confirm your information",
      level: 2,
      exact: true,
    });
    this.personalInfoHeading = page.getByRole("heading", {
      name: "Personal information",
      level: 3,
    });
    this.addressHeading = page.getByRole("heading", {
      name: "Address",
      level: 3,
      exact: true,
    });

    this.firstNameHeading = page.getByText("First name", { exact: true });
    this.lastNameHeading = page.getByText("Last name", { exact: true });
    this.dateOfBirthHeading = page.getByText("Date of birth", { exact: true });
    this.emailHeading = page.getByText("Email address", { exact: true });
    this.receiveInfoHeading = page.getByText(
      "Receive information about NYPL's programs and services",
      { exact: true }
    );

    this.streetHeading = page.getByText("Street address", { exact: true });
    this.cityHeading = page.getByText("City", { exact: true });
    this.stateHeading = page.getByText("State", { exact: true });
    this.postalCodeHeading = page.getByText("Postal code", { exact: true });
    this.addressEditButton = page.locator("#editAddressButton");
    this.editPersonalInfoButton = page
      .getByRole("button", {
        name: "Edit Personal information",
        exact: true,
      })
      .first();
    this.firstNameInput = page.getByRole("textbox", {
      name: "First name (required)",
      exact: true,
    });
    this.lastNameInput = page.getByRole("textbox", {
      name: "Last name (required)",
      exact: true,
    });
    this.dateOfBirthInput = page.getByRole("textbox", {
      name: "Date of birth (required)",
      exact: true,
    });
    this.emailInput = page.getByRole("textbox", {
      name: "Email address (required)",
      exact: true,
    });
    this.receiveInfoChoice = page.getByText("Yes", { exact: true });
    this.receiveInfoCheckbox = page.getByText(
      "Yes, I would like to receive information about NYPL's programs and services",
      { exact: true }
    );
    this.alternateFormLink = this.page.getByRole("link", {
      name: "alternate form",
      exact: true,
    });
    this.locationsLink = this.page.getByRole("link", {
      name: "locations",
      exact: true,
    });
    this.createYourAccountHeading = page.getByRole("heading", {
      name: "Create your account",
      level: 3,
    });
    this.usernameHeading = page.getByText("Username", { exact: true });
    this.passwordHeading = page.getByText("Password", { exact: true });
    this.showPasswordCheckbox = page.getByText("Show Password", {
      exact: true,
    });
    this.homeLibraryHeading = page.getByText("Home Library", { exact: true });
    this.defaultHomeLibrary = page.getByText("E-Branch", { exact: true });
    this.accountEditButton = page.getByRole("button", {
      name: "Edit Create your account",
      exact: true,
    });
    this.usernameInput = page.getByRole("textbox", {
      name: "Username (required)",
      exact: true,
    });
    this.passwordInput = page.getByRole("textbox", {
      name: "Password (Required)",
      exact: true,
    });
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: "Verify Password (Required)",
      exact: true,
    });
    this.availableUsernameButton = page.getByRole("button", {
      name: "Check if username is available",
      exact: true,
    });
    this.availableUsernameMessage = page.getByText(USERNAME_AVAILABLE_MESSAGE);
    this.unavailableUsernameError = page.getByText(
      USERNAME_UNAVAILABLE_MESSAGE
    );
    this.homeLibraryDropdown = page.getByLabel("Select a home library:");
    this.cardholderTermsLink = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
      exact: true,
    });
    this.rulesRegulationsLink = page.getByRole("link", {
      name: "Rules and Regulations",
      exact: true,
    });
    this.privacyPolicyLink = page
      .locator("#mainContent")
      .getByRole("link", { name: "Privacy Policy", exact: true });
    this.acceptTermsCheckbox = page.getByText(
      "Yes, I accept the terms and conditions."
    );
    this.submitButton = page.getByRole("button", {
      name: "Submit",
      exact: true,
    });
    this.formSubmissionUserNameError = page.getByRole("heading", {
      // remove?
      name: "Form submission error",
    });
  }

  getText(expected: string) {
    return this.page.getByText(expected, { exact: true });
  }
}
