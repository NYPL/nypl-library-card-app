import { Page, Locator } from "@playwright/test";

export class LocationPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly addressHeading: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: /^Step \d of 5: .+$/,
      level: 2,
    });
    this.addressHeading = page.getByRole("heading", {
      name: "Home Address",
      level: 3,
    });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.previousButton = page.getByRole("link", { name: "Previous" });
  }
}
