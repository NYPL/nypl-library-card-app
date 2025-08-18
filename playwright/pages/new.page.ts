import { Page, Locator } from "@playwright/test";

export class NewPage {
  readonly page: Page;
  readonly applyHeading: Locator;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applyHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Today in a Few Easy Steps",
      level: 2,
    });
    this.getStartedButton = page.getByRole("link", { name: "Get Started" });
  }
}
