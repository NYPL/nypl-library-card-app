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
  readonly postalCodeInput: Locator;
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
      name: appContent?.location?.workAddress?.title || "Alternate address",
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: appContent?.location?.workAddress?.title || "Alternate address",
      level: 3,
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
