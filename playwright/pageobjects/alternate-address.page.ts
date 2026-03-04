import { Page, Locator } from "@playwright/test";
import { ERROR_MESSAGES } from "../utils/constants";

export class AlternateAddressPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator; // alternate address does not specify step
  readonly addressHeading: Locator;
  readonly streetAddressInput: Locator;
  readonly apartmentSuiteInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly spinner: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly streetAddressError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly postalCodeError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Step 2 of 5: Alternate address",
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: "Alternate address (optional)",
      level: 3,
    });
    this.streetAddressInput = page.getByLabel(/Street address/i);
    this.streetAddressError = page.getByText(
      ERROR_MESSAGES.STREET_ADDRESS_INVALID
    );
    this.apartmentSuiteInput = page.getByLabel(/Apartment \/ Suite/i);
    this.cityInput = page.getByLabel(/City/i);
    this.cityError = page.getByText(ERROR_MESSAGES.CITY_INVALID);
    this.stateInput = page.getByLabel(/State/i);
    this.stateError = page.getByText(ERROR_MESSAGES.STATE_INVALID);
    this.postalCodeInput = page.getByLabel(/Postal code/i);
    this.postalCodeError = page.getByText(ERROR_MESSAGES.POSTAL_CODE_INVALID);
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
    this.spinner = this.page.getByRole("status", { name: "Loading Indicator" });
  }
}
