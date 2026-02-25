import { Page, Locator } from "@playwright/test";

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
  readonly showPasswordLabel: Locator;
  readonly homeLibraryHeading: Locator;
  readonly selectHomeLibrary: Locator;
  readonly homeLibraryError: Locator;
  readonly cardholderTerms: Locator;
  readonly rulesRegulations: Locator;
  readonly privacyPolicy: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly acceptTermsLabel: Locator;
  readonly acceptTermsError: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;

    const required = appContent?.required || "required";
    const withRequired = (label: string) => `${label} (${required})`;

    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: appContent?.account?.title || "Step 4 of 5: Customize your account",
      level: 2,
    });
    this.usernameInput = page.getByRole("textbox", {
      name: withRequired(appContent?.account?.username?.label || "Username"),
      exact: true,
    });
    this.usernameError = page.getByText(
      appContent?.account?.errorMessage?.username ||
        "There was a problem. Username must be between 5-25 alphanumeric characters."
    );
    this.availableUsernameButton = page.getByRole("button", {
      name:
        appContent?.account?.username?.checkButton ||
        "Check if username is available",
      exact: true,
    });
    this.availableUsernameMessage = page.getByText(
      "This username is available.",
      { exact: true }
    );
    this.unavailableUsernameMessage = page.getByText(
      "This username is unavailable. Please try another.",
      { exact: true }
    );
    this.passwordInput = page.getByRole("textbox", {
      name: withRequired(appContent?.account?.password?.label || "Password"),
      exact: true,
    });
    this.passwordError = page.getByText(
      appContent?.account?.errorMessage?.password ||
        "There was a problem. Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)"
    );
    this.verifyPasswordInput = page.getByRole("textbox", {
      name: withRequired(
        appContent?.account?.verifyPassword?.label || "Verify password"
      ),
      exact: true,
    });
    this.verifyPasswordError = page.getByText(
      appContent?.account?.errorMessage?.verifyPassword ||
        "There was a problem. The two passwords don't match."
    );
    this.showPasswordCheckbox = page.getByRole("checkbox", {
      name: appContent?.account?.showPassword || "Show password",
    });
    this.showPasswordLabel = page.getByText(
      appContent?.account?.showPassword || "Show password",
      { exact: true }
    );
    this.homeLibraryHeading = page.getByRole("heading", {
      name: appContent?.account?.library?.title || "Home library",
      level: 3,
      exact: true,
    });
    this.selectHomeLibrary = page.getByLabel(
      appContent?.account?.library?.selectLibrary || "Select a home library:"
    );
    this.homeLibraryError = page.getByText(
      appContent?.account?.errorMessage?.homeLibraryCode ||
        "There was a problem. Please select a home library."
    );
    this.cardholderTerms = page.getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.termsConditions ||
        "Cardholder Terms and Conditions",
    });
    this.rulesRegulations = page.getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.rulesRegulations ||
        "Rules and Regulations",
    });
    this.privacyPolicy = page.locator("#mainContent").getByRole("link", {
      name:
        appContent?.account?.termsAndCondition?.privacyPolicy ||
        "Privacy Policy",
    });
    this.acceptTermsCheckbox = page.getByRole("checkbox", {
      name:
        appContent?.account?.termsAndCondition?.label ||
        "Yes, I accept the terms and conditions.",
    });
    this.acceptTermsLabel = page.getByText(
      appContent?.account?.termsAndCondition?.label ||
        "Yes, I accept the terms and conditions."
    );
    this.acceptTermsError = page.getByText(
      appContent?.account?.errorMessage?.acceptTerms ||
        "There was a problem. The Terms and Conditions must be checked."
    );
    this.nextButton = page.getByRole("button", {
      name: appContent?.button?.next || "Next",
      exact: true,
    });
    this.previousButton = page.getByRole("link", {
      name: appContent?.button?.previous || "Previous",
      exact: true,
    });
  }
}
