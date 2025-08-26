import { Page, Locator } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly applyHeading: Locator; // displays only on landing page
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.applyHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Today in a Few Easy Steps",
      level: 2,
    });
    this.getStartedButton = page.getByRole("link", { name: "Get Started" });
  }
}
