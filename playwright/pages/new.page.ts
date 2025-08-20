import { Page, Locator } from "@playwright/test";

export class NewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly arabicLanguage: Locator;
  readonly applyHeading: Locator; // displays only on landing page
  readonly learnMore: Locator;
  readonly cardholderTerms: Locator;
  readonly rulesRegulations: Locator;
  readonly privacyPolicy: Locator;
  readonly getStartedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.arabicLanguage = page.getByRole("link", { name: "Arabic" });
    this.applyHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Today in a Few Easy Steps",
      level: 2,
    });
    this.learnMore = page.getByRole("link", { name: "Learn more" });
    this.cardholderTerms = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
    });
    this.rulesRegulations = page.getByRole("link", {
      name: "Rules and Regulations",
    });
    this.privacyPolicy = page.getByRole("link", { name: "Privacy Policy" });
    this.getStartedButton = page.getByRole("link", { name: "Get Started" });
  }
}
