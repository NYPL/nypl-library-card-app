import { Page, Locator } from "@playwright/test";

export class CongratsPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly locationsLink: Locator;
  readonly photoIdAndProofOfAddressLink: Locator;
  readonly getHelpEmailLink: Locator;
  readonly loginLink: Locator;
  readonly findOutLibraryLink: Locator;
  readonly discoverLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name:
        "Congratulations! You now have a digital New York Public Library card.",
      level: 2,
    });

    this.locationsLink = page.getByRole("link", {
      name: "locations",
      exact: true,
    });
    this.photoIdAndProofOfAddressLink = page.getByRole("link", {
      name: "photo ID and proof of address",
    });
    this.getHelpEmailLink = page.getByRole("link", {
      name: "gethelp@nypl.org",
    });
    this.loginLink = page.getByRole("link", { name: "Log into your account" });
    this.findOutLibraryLink = page.getByRole("link", {
      name: "Find out about all the Library has to offer.",
    });
    this.discoverLink = page.getByRole("link", {
      name: "Discover everything you can do with your library card.",
    });
  }
}
