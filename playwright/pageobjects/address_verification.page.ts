import { Page, Locator } from "@playwright/test";

export class AddressVerificationPage {
  readonly page: Page;
  readonly mainHeader: Locator;
  readonly subHeader: Locator;
  readonly homeAddressHeader: Locator;
  readonly addressDisplayed: Locator;
  readonly alternativeAddressDisplayed: Locator;
  readonly verifyRadioButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeader = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
    });
    this.subHeader = this.page.getByRole("heading", {
      name: "Step 3 of 5: Address Verification",
    });
    this.homeAddressHeader = this.page.getByRole("heading", {
      name: "Home Address",
    });
    this.addressDisplayed = this.page.getByText(
      /^(\d+)\s+([A-Za-z0-9\s#.\-&,']{2,})\s+([A-Za-z\s]{2,}),\s+([A-Z]{2})\s+([0-9]{5}(?:-[0-9]{4})?)$/
    );

    this.verifyRadioButton = page.locator(
      'span.radio-input[aria-hidden="true"]'
    );
    this.previousButton = this.page.getByRole("link", { name: "Previous" });
    this.nextButton = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });
  }
}
