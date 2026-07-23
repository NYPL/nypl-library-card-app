import { Page, Locator } from "@playwright/test";

export class PageNotFoundPage {
  readonly page: Page;
  readonly homeBreadcrumb: Locator; //breadcrumb 1
  readonly getALibarayCardBreadcrumb: Locator; //breadcrubm 2
  readonly errorIcon: Locator;
  readonly errorTitle: Locator;
  readonly errorMessage: Locator;
  readonly homeLink: Locator;
  readonly getALibraryCarLink: Locator;
  readonly newApplicationLink: Locator;
  readonly contactUsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.homeBreadcrumb = page
      .getByTestId("ds-breadcrumbs")
      .getByRole("link", { name: "Home" });
    this.getALibarayCardBreadcrumb = page
      .getByTestId("ds-breadcrumbs")
      .getByRole("link", { name: "Get A Library Card" });

    this.errorIcon = page.locator("svg").first();
    // future fix: add data-testid="404-icon to this icon or warpping element
    // swap test with this.errorIcon = page.getByTestID("404-icon");
    this.errorTitle = page.getByRole("heading", {
      name: "We couldn't find that page",
      level: 2,
    });
    this.errorMessage = page.getByText(
      "The page you were looking for doesn't exist or may have moved elsewhere."
    );

    this.newApplicationLink = page.getByRole("link", {
      name: "new application",
    });

    this.contactUsLink = page.getByRole("link", { name: "contact us" });
  }
}
