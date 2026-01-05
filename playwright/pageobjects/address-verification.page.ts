import { Page, Locator } from "@playwright/test";

export class AddressVerificationPage {
  readonly page: Page;
  readonly mainHeader: Locator;
  readonly stepHeader: Locator;
  readonly homeAddressHeader: Locator;
  readonly alternateAddressHeader: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeader = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeader = this.page.getByRole("heading", {
      name: "Step 3 of 5: Address verification",
      level: 2,
    });
    this.homeAddressHeader = this.page.getByRole("heading", {
      name: "Home address",
      level: 3,
    });
    this.alternateAddressHeader = this.page.getByRole("heading", {
      name: "Alternate address",
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

  getHomeAddressOption(street: string): Locator {
    return this.page.getByLabel("Home address").getByText(street);
  }

  getAlternateAddressOption(street: string): Locator {
    return this.page.getByLabel("Alternate address").getByText(street);
  }
}
