import { Page, Locator } from "@playwright/test";

export class CongratsPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly temporaryHeading: Locator;
  readonly getStartedHeading: Locator;
  readonly memberNameHeading: Locator;
  readonly memberName: Locator;
  readonly issuedDateHeading: Locator;
  readonly issuedDate: Locator;
  readonly libraryCardBackground: Locator;
  readonly locationsLink: Locator;
  readonly photoIdAndProofOfAddressLink: Locator;
  readonly getHelpEmailLink: Locator;
  readonly loginLink: Locator;
  readonly findOutLibraryLink: Locator;
  readonly discoverLink: Locator;
  readonly patronBarcodeNumber: Locator;
  readonly EXPECTED_BARCODE_PREFIX = "255";
  readonly temporaryCardBanner: Locator;
  readonly learnMoreLink: Locator;
  readonly PATRON_TYPE_7 = 7;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.temporaryHeading = page.getByRole("heading", {
      name: "Congratulations! You now have a temporary digital New York Public Library card.",
      level: 2,
    });
    this.getStartedHeading = page.getByRole("heading", {
      name: "Get started with The New York Public Library",
      level: 2,
    });
    this.memberNameHeading = page
      .locator("#member-name")
      .getByText("MEMBER NAME");
    this.memberName = page.locator("#member-name .content");
    this.issuedDateHeading = page.locator("#issued").getByText("ISSUED");
    this.issuedDate = page.locator("#issued").getByText(this.getDate(), {
      exact: true,
    });

    this.patronBarcodeNumber = page.locator(".barcode");
    this.libraryCardBackground = page.locator(".background-lion");
    this.locationsLink = page.getByRole("link", {
      name: "NYPL location",
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

    this.temporaryCardBanner = page.locator("aside", {
      hasText: "This is a temporary card",
    });
    this.learnMoreLink = this.temporaryCardBanner.getByRole("link", {
      name: /learn more/i,
    });
  }

  public getDate(): string {
    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1).toString()}/${today
      .getDate()
      .toString()}/${today.getFullYear()}`;
    return formattedDate; // M/D/YYYY
  }
}
