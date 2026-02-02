import { Page, Locator } from "@playwright/test";

export class AddressVerificationPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly homeAddressHeading: Locator;
  readonly alternateAddressHeading: Locator;
  readonly radioButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = this.page.getByRole("heading", {
      name: "Step 3 of 5: Address verification",
      level: 2,
    });
    this.homeAddressHeading = this.page.getByRole("heading", {
      name: "Home address",
      level: 3,
    });
    this.alternateAddressHeading = this.page.getByRole("heading", {
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

    this.radioButton = this.page.getByRole("radio").first();
  }

  getHomeAddressOption(street: string): Locator {
    return this.page.getByLabel("Home address").getByText(street);
  }

  getAlternateAddressOption(street: string): Locator {
    return this.page.getByLabel("Alternate address").getByText(street);
  }
}
