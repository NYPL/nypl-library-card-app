import { Page, Locator } from "@playwright/test";

export class AlternateAddressPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly informationalBanner: Locator;
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

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name:
        appContent?.location?.workAddress?.title ||
        "Step 2 of 5: Alternate address",
      level: 2,
    });
    this.informationalBanner = page.locator("aside", {
      hasText:
        "Please provide the address of where you work, attend school, or pay property taxes in New York State.",
    });
    this.addressHeading = page.getByRole("heading", {
      name:
        appContent?.location?.workAddress?.subtitle ||
        "Alternate address (optional)",
      level: 3,
    });
    this.streetAddressInput = page.getByLabel(
      appContent?.location?.address?.line1?.label || "Street address"
    );
    this.streetAddressError = page.getByText(
      appContent?.location?.errorMessage?.line1 ||
        "There was a problem. Please enter a valid street address."
    );
    this.apartmentSuiteInput = page.getByLabel(
      appContent?.location?.address?.line2?.label || "Apartment / Suite"
    );
    this.cityInput = page.getByLabel(
      appContent?.location?.address?.city?.label || "City"
    );
    this.cityError = page.getByText(
      appContent?.location?.errorMessage?.city ||
        "There was a problem. Please enter a valid city."
    );
    this.stateInput = page.getByLabel(
      appContent?.location?.address?.state?.label || "State"
    );
    this.stateError = page.getByText(
      appContent?.location?.errorMessage?.state ||
        "There was a problem. Please enter a 2-character state abbreviation."
    );
    this.postalCodeInput = page.getByLabel(
      appContent?.location?.address?.postalCode?.label || "Postal code"
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
