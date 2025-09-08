import { Page, Locator } from "@playwright/test";

export class AccountPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly homeLibraryHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator
  readonly verifyPasswordInput: Locator
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
    this.homeLibraryHeading = page.getByRole("heading", {
      name: "Home Library",
      level: 3,
    });
    this.usernameInput = page.getByLabel(/Username/i);
    this.passwordInput = page.getByLabel(/Password/i);
    this.verifyPasswordInput = page.getByLabel(/Verify Password/i);
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
