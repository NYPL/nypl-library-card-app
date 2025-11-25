import { Page, Locator } from "@playwright/test";
import { TEST_PATRON_INFO } from "../utils/constants";

export class CongratsPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly getStartedHeading: Locator;
  readonly memberNameHeading: Locator;
  readonly memberName: Locator;
  readonly issuedDateHeading: Locator;
  readonly issuedDate: Locator;
  readonly barcodeNumber: Locator;
  readonly libraryCardBackground: Locator;
  readonly locationsLink: Locator;
  readonly photoIdAndProofOfAddressLink: Locator;
  readonly getHelpEmailLink: Locator;
  readonly loginLink: Locator;
  readonly findOutLibraryLink: Locator;
  readonly discoverLink: Locator;
  // readonly displayBarcodeNumber: Locator;
  readonly EXPECTED_BARCODE_PREFIX = "255";

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Congratulations! You now have a digital New York Public Library card.",
      level: 2,
    });
    this.getStartedHeading = page.getByRole("heading", {
      name: "Get Started with The New York Public Library",
      level: 2,
    });
    this.memberNameHeading = page
      .locator("#member-name")
      .getByText("MEMBER NAME");
    this.memberName = page.getByText(
      `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`,
      { exact: true }
    );
    this.issuedDateHeading = page.locator("#issued").getByText("ISSUED");
    this.issuedDate = page.locator("#issued").getByText(this.getDate(), {
      exact: true,
    });
    this.barcodeNumber = page.getByLabel("Barcode number");
    // this.displayBarcodeNumber = page.locator(
    //   "#congratulations > div.confirmation-graphic > div > div > div.grid-item.barcode-container > div"
    // );
    this.libraryCardBackground = page.locator(".background-lion");
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

  public getDate(): string {
    const today = new Date();
    const formattedDate = `${(today.getMonth() + 1).toString()}/${today
      .getDate()
      .toString()}/${today.getFullYear()}`;
    return formattedDate; // M/D/YYYY
  }
}
