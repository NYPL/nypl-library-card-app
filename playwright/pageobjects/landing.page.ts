import { Page, Locator } from "@playwright/test";

export class LandingPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly arabicLanguage: Locator;
  readonly bengaliLanguage: Locator;
  readonly chineseLanguage: Locator;
  readonly englishLanguage: Locator;
  readonly frenchLanguage: Locator;
  readonly haitianCreoleLanguage: Locator;
  readonly koreanLanguage: Locator;
  readonly polishLanguage: Locator;
  readonly russianLanguage: Locator;
  readonly spanishLanguage: Locator;
  readonly urduLanguage: Locator;
  readonly applyHeading: Locator; // displays only on landing page
  readonly whatYouCanAccess: Locator;
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
    this.arabicLanguage = page.getByRole("link", {
      name: "Arabic | العَرَبِية",
    });
    this.bengaliLanguage = page.getByRole("link", { name: "Bengali | বাঙালি" });
    this.chineseLanguage = page.getByRole("link", {
      name: "Chinese (Simplified) | 简体中文",
    });
    this.englishLanguage = page.getByRole("link", { name: "English" });
    this.frenchLanguage = page.getByRole("link", { name: "French | Français" });
    this.haitianCreoleLanguage = page.getByRole("link", {
      name: "Haitian Creole | Kreyòl Ayisyen",
    });
    this.koreanLanguage = page.getByRole("link", { name: "Korean | 한국어" });
    this.polishLanguage = page.getByRole("link", { name: "Polish | Polski" });
    this.russianLanguage = page.getByRole("link", {
      name: "Russian | Русский",
    });
    this.spanishLanguage = page.getByRole("link", {
      name: "Spanish | Español",
    });
    this.urduLanguage = page.getByRole("link", { name: "Urdu | اُردُو" });
    this.applyHeading = page.getByRole("heading", {
      name: "Apply for a library card today in a few easy steps",
      level: 2,
    });
    this.whatYouCanAccess = page.getByRole("link", {
      name: "what you can access",
    });
    this.cardholderTerms = page.getByRole("link", {
      name: "Cardholder Terms and Conditions",
    });
    this.rulesRegulations = page.getByRole("link", {
      name: "Rules and Regulations",
    });
    this.privacyPolicy = page
      .locator("#mainContent")
      .getByRole("link", { name: "Privacy Policy" });
    this.getStartedButton = page.getByRole("link", { name: "Get started" });
  }
}
