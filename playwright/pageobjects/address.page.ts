import { Page, Locator } from "@playwright/test";

export class AddressPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly addressHeading: Locator;
  readonly streetAddressInput: Locator;
  readonly apartmentSuiteInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly streetAddressError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
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
    this.streetAddressError = page.getByText(
      "Please enter a valid street address."
    );
    this.cityError = page.getByText("Please enter a valid city.");
    this.stateError = page.getByText(
      "Please enter a 2-character state abbreviation."
    );
    this.postalCodeError = page.getByText(
      "Please enter a 5 or 9-digit postal code."
    );
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.previousButton = page.getByRole("link", { name: "Previous" });
  }
}
