import { Page, Locator } from "@playwright/test";
import { ERROR_MESSAGES } from "../utils/constants";

export class AccountPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly usernameInput: Locator;
  readonly usernameError: Locator;
  readonly availableUsernameButton: Locator;
  readonly availableUsernameMessage: Locator;
  readonly unavailableUsernameMessage: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly verifyPasswordInput: Locator;
  readonly verifyPasswordError: Locator;
  readonly showPasswordCheckbox: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
  readonly homeLibraryError: Locator;
  readonly cardholderTerms: Locator;
  readonly rulesRegulations: Locator;
  readonly privacyPolicy: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly acceptTermsError: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Step 4 of 5: Customize your account",
      level: 2,
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
    this.passwordInput = page.getByRole("textbox", {
      name: "Password (required)",
      exact: true,
    });
    this.passwordError = page.getByText(ERROR_MESSAGES.PASSWORD_INVALID);
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: "Verify password (required)",
      exact: true,
    });
    this.verifyPasswordError = page.getByText(
      ERROR_MESSAGES.VERIFY_PASSWORD_INVALID
    );
    this.showPasswordCheckbox = page.getByText("Show password", {
      exact: true,
    });
    this.homeLibraryHeading = page.getByRole("heading", {
      name: "Home library",
      level: 3,
      exact: true,
    });
    this.selectHomeLibrary = page.getByLabel("Select a home library:");
    this.homeLibraryError = page.getByText(ERROR_MESSAGES.HOME_LIBRARY_ERROR);
    this.cardholderTerms = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
    });
    this.rulesRegulations = page.getByRole("link", {
      name: "Rules and Regulations",
    });
    this.privacyPolicy = page
      .locator("#mainContent")
      .getByRole("link", { name: "Privacy Policy" });
    this.acceptTermsCheckbox = page.getByText(
      "Yes, I accept the terms and conditions."
    );

    this.acceptTermsError = page.getByText(ERROR_MESSAGES.ACCEPT_TERMS_ERROR);
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
