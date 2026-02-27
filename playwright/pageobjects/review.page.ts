import { Page, Locator } from "@playwright/test";
import { ERROR_MESSAGES } from "../utils/constants";

export class ReviewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;

  // Personal Information section
  readonly personalInfoHeading: Locator;
  readonly firstNameHeading: Locator;
  readonly firstNameInputHeading: Locator;
  readonly firstNameInput: Locator;
  readonly firstNameError: Locator;
  readonly lastNameHeading: Locator;
  readonly lastNameInputHeading: Locator;
  readonly lastNameInput: Locator;
  readonly lastNameError: Locator;
  readonly dateOfBirthHeading: Locator;
  readonly dateOfBirthInputHeading: Locator;
  readonly dateOfBirthInput: Locator;
  readonly dateOfBirthInvalid: Locator;
  readonly dateOfBirthError: Locator;
  readonly emailHeading: Locator;
  readonly emailInputHeading: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly receiveInfoHeading: Locator;
  readonly receiveInfoChoice: Locator;
  readonly receiveInfoCheckbox: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;
  readonly editPersonalInfoButton: Locator;

  // Address section
  readonly addressHeading: Locator;
  readonly streetHeading: Locator;
  readonly streetAddressInvalid: Locator;
  readonly streetAddressError: Locator;
  readonly cityHeading: Locator;
  readonly cityError: Locator;
  readonly stateHeading: Locator;
  readonly stateError: Locator;
  readonly postalCodeHeading: Locator;
  readonly postalCodeError: Locator;
  readonly editAddressButton: Locator;

  // Account section
  readonly createYourAccountHeading: Locator;
  readonly usernameHeading: Locator;
  readonly usernameInputHeading: Locator;
  readonly usernameInput: Locator;
  readonly usernameError: Locator;
  readonly availableUsernameButton: Locator;
  readonly availableUsernameMessage: Locator;
  readonly unavailableUsernameMessage: Locator;
  readonly passwordHeading: Locator;
  readonly passwordInputHeading: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly verifyPasswordInputHeading: Locator;
  readonly verifyPasswordInput: Locator;
  readonly verifyPasswordError: Locator;
  readonly showPasswordLabel: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
  readonly homeLibraryError: Locator;
  readonly cardholderTermsLink: Locator;
  readonly rulesRegulationsLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly acceptTermsLabel: Locator;
  readonly acceptTermsError: Locator;
  readonly editAccountButton: Locator;
  readonly submitButton: Locator;

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

    // Personal Information section
    this.personalInfoHeading = page.getByRole("heading", {
      name: "Personal information",
      level: 3,
    });
    this.firstNameHeading = page.getByText("First name", { exact: true });
    this.firstNameInputHeading = page.getByText("First name (required)", {
      exact: true,
    });
    this.firstNameInput = page.getByRole("textbox", {
      name: "First name (required)",
      exact: true,
    });
    this.firstNameError = page.getByText(
      "There was a problem. Please enter a valid first name."
    );
    this.lastNameHeading = page.getByText("Last name", { exact: true });
    this.lastNameInputHeading = page.getByText("Last name (required)", {
      exact: true,
    });
    this.lastNameInput = page.getByRole("textbox", {
      name: "Last name (required)",
      exact: true,
    });
    this.lastNameError = page.getByText(
      "There was a problem. Please enter a valid last name."
    );
    this.dateOfBirthHeading = page.getByText("Date of birth", { exact: true });
    this.dateOfBirthInputHeading = page.getByText("Date of birth (required)", {
      exact: true,
    });
    this.dateOfBirthInput = page.getByRole("textbox", {
      name: "Date of birth (required)",
      exact: true,
    });
    this.dateOfBirthInvalid = this.page.getByText("There was a problem. Please enter a valid date, MM/DD/YYYY, including slashes.");
    this.dateOfBirthError = this.page.getByText("There was a problem. Date of birth is below the minimum age of 13.");
    this.emailHeading = page.getByText("Email address", { exact: true });
    this.emailInputHeading = page.getByText("Email address (required)", {
      exact: true,
    });
    this.emailInput = page.getByRole("textbox", {
      name: "Email address (required)",
      exact: true,
    });
    this.emailError = page.getByText(
      "There was a problem. Please enter a valid email address."
    );
    this.receiveInfoHeading = page.getByText(
      "Receive information about NYPL's programs and services",
      { exact: true }
    );
    this.receiveInfoChoice = page.getByText("Yes", { exact: true });
    this.receiveInfoCheckbox = page.getByText(
      "Yes, I would like to receive information about NYPL's programs and services",
      { exact: true }
    );
    this.alternateFormLink = this.page.getByRole("link", {
      name: "alternate form",
    });
    this.locationsLink = this.page.locator("#mainContent").getByRole("link", {
      name: "locations",
    });
    this.editPersonalInfoButton = page.getByRole("button", {
      name: "Edit Personal information",
      exact: true,
    });

    // Address section
    this.addressHeading = page.getByRole("heading", {
      name: "Address",
      level: 3,
      exact: true,
    });
    this.streetHeading = page.getByText("Street address", { exact: true });
    this.streetAddressInvalid = page.getByText(
      "There was a problem. Please enter a valid home street address."
    );
    this.streetAddressError = page.getByText(
      "Street address fields must not be more than 100 lines."
    );
    this.cityHeading = page.getByText("City", { exact: true });
    this.cityError = page.getByText(
      "There was a problem. Please enter a valid home city."
    );
    this.stateHeading = page.getByText("State", { exact: true });
    this.stateError = page.getByText(
      "There was a problem. Please enter a 2-character home state abbreviation."
    );
    this.postalCodeHeading = page.getByText("Postal code", { exact: true });
    this.postalCodeError = page.getByText(
      "There was a problem. Please enter a 5 or 9-digit home postal code."
    );
    this.editAddressButton = page.getByRole("button", {
      name: "Edit Address",
      exact: true,
    });

    // Account section
    this.createYourAccountHeading = page.getByRole("heading", {
      name: "Create your account",
      level: 3,
    });
    this.usernameHeading = page.getByText("Username", { exact: true });
    this.usernameInputHeading = page.getByText("Username (required)", {
      exact: true,
    });
    this.usernameInput = page.getByRole("textbox", {
      name: "Username (required)",
      exact: true,
    });
    this.usernameError = page.getByText(ERROR_MESSAGES.USERNAME_INVALID);
    this.availableUsernameButton = page.getByRole("button", {
      name: "Check if username is available",
      exact: true,
    });
    this.availableUsernameMessage = page.getByText(
      ERROR_MESSAGES.USERNAME_AVAILABLE
    );
    this.unavailableUsernameMessage = page.getByText(
      ERROR_MESSAGES.USERNAME_UNAVAILABLE
    );
    this.passwordHeading = page.getByText("Password", { exact: true });
    this.passwordInputHeading = page.getByText("Password (required)", {
      exact: true,
    });
    this.passwordInput = page.getByRole("textbox", {
      name: "Password (required)",
      exact: true,
    });
    this.passwordError = page.getByText(ERROR_MESSAGES.PASSWORD_INVALID);
    this.verifyPasswordInputHeading = page.getByText(
      "Verify password (required)",
      { exact: true }
    );
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: "Verify password (required)",
      exact: true,
    });
    this.verifyPasswordError = page.getByText(
      ERROR_MESSAGES.VERIFY_PASSWORD_INVALID
    );
    this.showPasswordLabel = page.getByText("Show password", {
      exact: true,
    });
    this.homeLibraryHeading = page.getByText("Home library", { exact: true });
    this.selectHomeLibrary = page.getByLabel("Select a home library:");
    this.homeLibraryError = page.getByText(ERROR_MESSAGES.HOME_LIBRARY_ERROR);
    this.cardholderTermsLink = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
    });
    this.rulesRegulationsLink = page.getByRole("link", {
      name: "Rules and Regulations",
    });
    this.privacyPolicyLink = page.locator("#mainContent").getByRole("link", {
      name: "Privacy Policy",
    });
    this.acceptTermsLabel = page.getByText(
      "Yes, I accept the terms and conditions.",
      {
        exact: true,
      }
    );
    this.acceptTermsError = page.getByText(ERROR_MESSAGES.ACCEPT_TERMS_ERROR);
    this.editAccountButton = page.getByRole("button", {
      name: "Edit Create your account",
      exact: true,
    });
    this.submitButton = page.getByRole("button", {
      name: "Submit",
      exact: true,
    });
  }

  getText(expected: string) {
    return this.page.getByText(expected, { exact: true });
  }
}
