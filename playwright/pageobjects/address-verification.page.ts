import { Page, Locator } from "@playwright/test";

export class AddressVerificationPage {
  readonly page: Page;
  readonly appContent: any;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly homeAddressHeading: Locator;
  readonly alternateAddressHeading: Locator;
  readonly spinner: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.appContent = appContent;
    this.mainHeading = this.page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = this.page.getByRole("heading", {
      name:
        appContent?.verifyAddress?.title || "Step 3 of 5: Address verification",
      level: 2,
    });
    this.homeAddressHeading = this.page.getByRole("heading", {
      name: appContent?.verifyAddress?.homeAddress || "Home address",
      level: 3,
    });
    this.alternateAddressHeading = this.page.getByRole("heading", {
      name: appContent?.verifyAddress?.workAddress || "Alternate address",
      level: 3,
    });
    this.previousButton = this.page.getByRole("link", {
      name: appContent?.button?.previous || "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: appContent?.button?.next || "Next",
      exact: true,
    });
    this.spinner = this.page.getByRole("status", { name: "Loading Indicator" });
  }

  getHomeAddressOption(street: string): Locator {
    return this.page
      .getByLabel(this.appContent?.verifyAddress?.homeAddress || "Home address")
      .getByText(street);
  }

  getAlternateAddressOption(street: string): Locator {
    return this.page
      .getByLabel(
        this.appContent?.verifyAddress?.workAddress || "Alternate address"
      )
      .getByText(street);
  }

  get getRadioButtons() {
    return this.page.getByRole("radiogroup").getByRole("radio");
  }
}
