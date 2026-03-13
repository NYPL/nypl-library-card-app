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
  readonly digitalResourcesLink: Locator;
  readonly visitLibraryLink: Locator;
  readonly alternateFormLink: Locator;
  readonly informationalBanner: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
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
      name:
        appContent?.home?.title ||
        "Apply for a library card today in a few easy steps",
      level: 2,
    });
    this.digitalResourcesLink = page.locator(
      "#mainContent a[href*='help/services/remote-resources']"
    );
    this.visitLibraryLink = page.locator(
      "#mainContent a[href*='nypl.org/locations']"
    );
    this.alternateFormLink = page.locator(
      "#mainContent a[href*='library-card#international-researchers']"
    );
    this.whatYouCanAccess = page.locator(
      "#mainContent a[href*='help/library-card']:not([href*='international-researchers']):not([href*='terms-conditions']), #mainContent a[href*='www.nypl.org/library-card']:not([href*='/library-card/new']):not([href*='/library-card/personal'])"
    );
    this.cardholderTerms = page.locator(
      "#mainContent a[href*='library-card/terms-conditions']"
    );
    this.rulesRegulations = page.locator(
      "#mainContent a[href*='policies-and-rules'], #mainContent a[href*='rules-and-regulations']"
    );
    this.privacyPolicy = page.locator(
      "#mainContent a[href*='privacy-policy'], #mainContent a[href*='copy_of_privacy_policy']"
    );
    this.informationalBanner = page.getByTestId("ds-banner");
    this.getStartedButton = page.getByRole("link", {
      name: appContent?.button?.start || "Get started",
    });
  }
}
