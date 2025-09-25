import { Page, Locator } from "@playwright/test";
import { TEST_ALTERNATE_ADDRESS } from "../utils/constants";

export class AddressVerificationPage {
  readonly page: Page;
  readonly mainHeader: Locator;
  readonly subHeader: Locator;
  readonly homeAddressHeader: Locator;
  readonly alternateAddressHeader: Locator;
  readonly alternateAddressOption: Locator;
  readonly verifyRadioButton: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeader = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.subHeader = this.page.getByRole("heading", {
      name: "Step 3 of 5: Address Verification",
      level: 2,
    });
    this.homeAddressHeader = this.page.getByRole("heading", {
      name: "Home Address",
    });
    this.alternateAddressHeader = this.page.getByRole("heading", {
      name: "Alternate Address",
      level: 3,
    });
    this.alternateAddressOption = this.page.getByRole("radio", {
      name: TEST_ALTERNATE_ADDRESS.street,
    });
    this.previousButton = this.page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });
  }
}
