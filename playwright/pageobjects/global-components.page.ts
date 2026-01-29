import { Page, Locator } from "@playwright/test";

export class GlobalComponentsPage {
  readonly page: Page;
  readonly homeBreadcrumb: Locator;
  readonly getLibraryCardBreadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeBreadcrumb = page.getByRole("link", { name: "Home", exact: true });
    this.getLibraryCardBreadcrumb = page
      .getByLabel("Breadcrumb")
      .getByRole("link", {
        name: "Get A Library Card",
        exact: true,
      });
  }
}
