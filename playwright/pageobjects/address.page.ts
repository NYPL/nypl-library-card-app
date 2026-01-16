import { Page, Locator } from "@playwright/test";
import { ERROR_MESSAGES } from "../utils/constants";

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
      name: "Home address",
      level: 3,
    });
    this.streetAddressInput = page.getByLabel(/Street address/i);
    this.apartmentSuiteInput = page.getByLabel(/Apartment \/ Suite/i);
    this.cityInput = page.getByLabel(/City/i);
    this.stateInput = page.getByLabel(/State/i);
    this.postalCodeInput = page.getByLabel(/Postal code/i);
    this.streetAddressError = page.getByText(
      ERROR_MESSAGES.STREET_ADDRESS_INVALID
    );
    this.cityError = page.getByText(ERROR_MESSAGES.CITY_INVALID);
    this.stateError = page.getByText(ERROR_MESSAGES.STATE_INVALID);
    this.postalCodeError = page.getByText(ERROR_MESSAGES.POSTAL_CODE_INVALID);
    this.nextButton = page.getByRole("button", { name: "Next", exact: true });
    this.previousButton = page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
  }
}
