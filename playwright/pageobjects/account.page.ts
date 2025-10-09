import { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly usernameInput: Locator;
  readonly usernameError: Locator;
  readonly availableUsernameButton: Locator;
  readonly availableUsername: Locator;
  readonly unavailableUsernameError: Locator;
  readonly passwordInput: Locator;
  readonly passwordError: Locator;
  readonly verifyPasswordInput: Locator;
  readonly verifyPasswordError: Locator;
  readonly showPasswordCheckbox: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
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
      name: "Step 4 of 5: Customize Your Account",
      level: 2,
    });

    this.usernameInput = page.getByRole("textbox", {
      name: "Username (Required)",
      exact: true,
    });
    this.usernameError = page.getByText(
      "Username must be between 5-25 alphanumeric characters."
    );
    this.availableUsernameButton = page.getByRole("button", {
      name: "Check if username is available",
      exact: true,
    });
    this.availableUsername = page.getByText("This username is available.");
    this.unavailableUsernameError = page.getByText(
      "This username is unavailable. Please try another."
    );
    this.passwordInput = page.getByRole("textbox", {
      name: "Password (Required)",
      exact: true,
    });
    this.passwordError = page.getByText(
      "Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)"
    );
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: "Verify Password (Required)",
      exact: true,
    });
    this.verifyPasswordError = page.getByText("The two passwords don't match.");
    this.showPasswordCheckbox = page.locator("#showPassword-wrapper svg");

    this.homeLibraryHeading = page.getByRole("heading", {
      name: "Home Library",
      level: 3,
      exact: true,
    });
    this.selectHomeLibrary = page.getByLabel("Select a home library:");
    this.cardholderTerms = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
      exact: true,
    });
    this.rulesRegulations = page.getByRole("link", {
      name: "Rules and Regulations",
      exact: true,
    });
    this.privacyPolicy = page
      .locator("#mainContent")
      .getByRole("link", { name: "Privacy Policy", exact: true });
    this.acceptTermsCheckbox = page.locator("#acceptTerms-wrapper svg");

    this.acceptTermsError = page.getByText(
      "The Terms and Conditions must be checked."
    );
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
