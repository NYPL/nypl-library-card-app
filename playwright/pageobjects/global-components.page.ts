import { Page, Locator } from "@playwright/test";

export class GlobalComponentsPage {
  readonly page: Page;
  readonly homeBreadcrumb: Locator;
  readonly getLibraryCardBreadcrumb: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    this.homeBreadcrumb = page.getByRole("link", { name: "Home", exact: true });
    this.getLibraryCardBreadcrumb = this.breadcrumb.getByRole("link", {
      name: "Get A Library Card",
      exact: true,
    });
  }
}
