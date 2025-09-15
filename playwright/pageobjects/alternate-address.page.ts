import { Page, Locator } from "@playwright/test";

export class AlternateAddressPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator; // alternate address does not specify step
  readonly addressHeading: Locator;
  readonly streetAddressInput: Locator;
  readonly apartmentSuiteInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly stateError: Locator;
  readonly postalCodeInput: Locator;
  readonly postalCodeError: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Alternate Address",
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: "Alternate Address",
      level: 3,
    });
    this.streetAddressInput = page.getByLabel(/Street Address/i);
    this.apartmentSuiteInput = page.getByLabel(/Apartment \/ Suite/i);
    this.cityInput = page.getByLabel(/City/i);
    this.stateInput = page.getByLabel(/State/i);
    this.stateError = page.getByText(
      "Please enter a 2-character state abbreviation."
    );
    this.postalCodeInput = page.getByLabel(/Postal Code/i);
    this.postalCodeError = page.getByText(
      "Please enter a 5-digit postal code."
    );
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
