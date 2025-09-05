import { Page, Locator } from "@playwright/test";

export class LocationPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly addressHeading: Locator;
  readonly streetAddressInput: Locator;
  readonly apartmentSuiteInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Step 2 of 5: Address",
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: "Home Address",
      level: 3,
    });
    this.streetAddressInput = page.getByLabel(/Street Address/i);
    this.apartmentSuiteInput = page.getByLabel(/Apartment \/ Suite/i);
    this.cityInput = page.getByLabel(/City/i);
    this.stateInput = page.getByLabel(/State/i);
    this.postalCodeInput = page.getByLabel(/Postal Code/i);
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.previousButton = page.getByRole("link", { name: "Previous" });
  }
}
