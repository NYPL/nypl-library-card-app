import { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly usernameInput: Locator;
  readonly availableUsernameButton: Locator;
  readonly passwordInput: Locator;
  readonly verifyPasswordInput: Locator;
  readonly showPasswordCheckbox: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
  readonly cardholderTerms: Locator;
  readonly rulesRegulations: Locator;
  readonly privacyPolicy: Locator;
  readonly acceptTermsCheckbox: Locator;
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
    
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.availableUsernameButton = page.getByRole("button", {
      name: "Check if username is available",
    });
    this.passwordInput = page.getByRole("textbox", {
      name: "Password (Required)",
      exact: true,
    });
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: "Verify Password (Required)",
    });
    this.showPasswordCheckbox = page.getByRole("checkbox", {
      name: "Show Password",
    });
    this.homeLibraryHeading = page.getByRole("heading", {
      name: "Home Library",
      level: 3,
    });
    this.selectHomeLibrary = page.getByLabel("Select a home library:");
    this.cardholderTerms = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
    });
    this.rulesRegulations = page.getByRole("link", {
      name: "Rules and Regulations",
    });
    this.privacyPolicy = page
      .locator("#mainContent")
      .getByRole("link", { name: "Privacy Policy" });
    this.acceptTermsCheckbox = page.getByRole("checkbox", {
      name: "Yes, I accept the terms and conditions.",
    });
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
