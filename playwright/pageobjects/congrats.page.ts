import { Page, Locator } from "@playwright/test";

export class CongratsPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly metroHeading: Locator;
  readonly temporaryHeading: Locator;
  readonly memberNameHeading: Locator;
  readonly memberName: Locator;
  readonly patronBarcodeNumber: Locator;
  readonly EXPECTED_BARCODE_PREFIX = "255";
  readonly issuedDateHeading: Locator;
  readonly issuedDate: Locator;
  readonly libraryCardBackground: Locator;
  readonly locationsLink: Locator;
  readonly photoIdAndProofOfAddressLink: Locator;
  readonly temporaryCardBanner: Locator;
  readonly learnMoreLink: Locator;
  readonly getHelpEmailLink: Locator;
  readonly getStartedHeading: Locator;
  readonly readListenLink: Locator;
  readonly loginLink: Locator;
  readonly nyplLocationLink: Locator;
  readonly findOutLibraryLink: Locator;
  readonly discoverLink: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.metroHeading = page.getByRole("heading", {
      name:
        appContent?.confirmation?.title?.metro ||
        "Congratulations! You now have a digital New York Public Library card.",
    });
    this.temporaryHeading = page.getByRole("heading", {
      name:
        appContent?.confirmation?.title?.temporary ||
        "Congratulations! You now have a temporary digital New York Public Library card.",
      level: 2,
    });
    this.memberNameHeading = page
      .locator("#member-name")
      .getByText(
        appContent?.confirmation?.graphic?.memberName || "MEMBER NAME"
      );
    this.memberName = page.locator("#member-name .content");
    this.issuedDateHeading = page
      .locator("#issued")
      .getByText(appContent?.confirmation?.graphic?.issued || "ISSUED");
    this.issuedDate = page.locator("#issued").getByText(this.getDate(), {
      exact: true,
    });
    this.patronBarcodeNumber = page.locator(".barcode");
    this.libraryCardBackground = page.locator(".background-lion");
    this.locationsLink = page.locator("#mainContent").getByRole("link", {
      name: appContent?.confirmation?.nextSteps?.nyplLocation || "locations",
    });
    this.photoIdAndProofOfAddressLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.proof ||
        "photo ID and proof of address",
    });
    this.temporaryCardBanner = page.locator("aside", {
      hasText:
        appContent?.confirmation?.description?.part3 ||
        "This is a temporary card",
    });
    this.learnMoreLink = this.temporaryCardBanner.getByRole("link", {
      name: appContent?.confirmation?.nextSteps?.learnMore || "learn more",
    });
    this.getHelpEmailLink = page.getByRole("link", {
      name: appContent?.confirmation?.nextSteps?.getHelp || "gethelp@nypl.org",
    });
    this.getStartedHeading = page.getByRole("heading", {
      name:
        appContent?.confirmation?.nextSteps?.title ||
        "Get started with The New York Public Library",
      level: 2,
    });
    this.readListenLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.readListen ||
        "Read or listen on-the-go",
    });
    this.loginLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.login || "Log into your account",
    });
    this.nyplLocationLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.nyplLocation || "NYPL location",
    });
    this.findOutLibraryLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.findOut ||
        "Find out about all the Library has to offer.",
    });
    this.discoverLink = page.getByRole("link", {
      name:
        appContent?.confirmation?.nextSteps?.discover ||
        "Discover everything you can do with your library card.",
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
