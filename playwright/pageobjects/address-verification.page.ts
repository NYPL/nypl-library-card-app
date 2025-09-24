import { Page, Locator } from "@playwright/test";

export class AddressVerificationPage {
  readonly page: Page;
  readonly mainHeader: Locator;
  readonly stepHeader: Locator;
  readonly homeAddressHeader: Locator;
  readonly alternateAddressHeader: Locator;
  readonly verifyRadioButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeader = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeader = this.page.getByRole("heading", {
      name: "Step 3 of 5: Address Verification",
      level: 2,
    });
    this.homeAddressHeader = this.page.getByRole("heading", {
      name: "Home Address",
      level: 3,
    });
    this.alternateAddressHeader = this.page.getByRole("heading", {
      name: "Alternate Address",
      level: 3,
    });
    this.previousButton = this.page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });
  }
}
