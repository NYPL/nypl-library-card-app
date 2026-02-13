import { Page, Locator } from "@playwright/test";

export class AddressPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly addressHeading: Locator;
  readonly alternateForm: Locator;
  readonly streetAddressInput: Locator;
  readonly apartmentSuiteInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly postalCodeInput: Locator;
  readonly streetAddressError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly postalCodeError: Locator;
  readonly spinner: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: appContent?.location?.title || "Step 2 of 5: Address",
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: appContent?.location?.address?.title || "Home address",
      level: 3,
    });
    this.alternateForm = page.getByRole("link", {
      name: appContent?.home?.description?.alternateForm || "alternate form",
    });
    this.streetAddressInput = page.getByLabel(
      appContent?.location?.address.line1.label || "Street address"
    );
    this.apartmentSuiteInput = page.getByLabel(
      appContent?.location?.address.line2.label || "Apartment / Suite"
    );
    this.cityInput = page.getByLabel(
      appContent?.location?.address.city.label || "City"
    );
    this.stateInput = page.getByLabel(
      appContent?.location?.address.state.label || "State"
    );
    this.postalCodeInput = page.getByLabel(
      appContent?.location?.address.postalCode.label || "Postal code"
    );
    this.streetAddressError = page.getByText(
      appContent?.location?.errorMessage?.line1 ||
        "There was a problem. Please enter a valid street address."
    );
    this.cityError = page.getByText(
      appContent?.location?.errorMessage?.city ||
        "There was a problem. Please enter a valid city."
    );
    this.stateError = page.getByText(
      appContent?.location?.errorMessage?.state ||
        "There was a problem. Please enter a 2-character state abbreviation."
    );
    this.postalCodeError = page.getByText(
      appContent?.location?.errorMessage?.zip ||
        "There was a problem. Please enter a 5 or 9-digit postal code."
    );
    this.nextButton = page.getByRole("button", {
      name: appContent?.button?.next || "Next",
      exact: true,
    });
    this.previousButton = page.getByRole("link", {
      name: appContent?.button?.previous || "Previous",
      exact: true,
    });
    this.spinner = this.page.getByRole("status", { name: "Loading Indicator" });
  }
}
