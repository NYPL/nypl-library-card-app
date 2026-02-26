import { test, expect } from "@playwright/test";
import { LandingPage } from "../pageobjects/landing.page";
import { PAGE_ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`landing page in ${name} (${lang})`, () => {
    let landingPage: LandingPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      landingPage = new LandingPage(page, appContent);
      await page.goto(PAGE_ROUTES.LANDING(lang));
    });

    test("displays headings and get started button", async () => {
      await expect(landingPage.mainHeading).toBeVisible();
      await expect(landingPage.applyHeading).toBeVisible();
      await expect(landingPage.getStartedButton).toBeVisible();
    });

    test("displays available languages", async () => {
      await expect(landingPage.arabicLanguage).toBeVisible();
      await expect(landingPage.bengaliLanguage).toBeVisible();
      await expect(landingPage.chineseLanguage).toBeVisible();
      await expect(landingPage.englishLanguage).toBeVisible();
      await expect(landingPage.frenchLanguage).toBeVisible();
      await expect(landingPage.haitianCreoleLanguage).toBeVisible();
      await expect(landingPage.koreanLanguage).toBeVisible();
      await expect(landingPage.polishLanguage).toBeVisible();
      await expect(landingPage.russianLanguage).toBeVisible();
      await expect(landingPage.spanishLanguage).toBeVisible();
      await expect(landingPage.urduLanguage).toBeVisible();
    });

    test("displays informational links and banner", async () => {
      await expect(landingPage.digitalResourcesLink).toBeVisible();
      await expect(landingPage.visitLibraryLink).toBeVisible();
      await expect(landingPage.alternateFormLink).toBeVisible();
      await expect(landingPage.whatYouCanAccess).toBeVisible();
      await expect(landingPage.cardholderTerms).toBeVisible();
      await expect(landingPage.rulesRegulations).toBeVisible();
      await expect(landingPage.privacyPolicy).toBeVisible();
      await expect(landingPage.informationalBanner).toBeVisible();
    });
  });

test("opens links in same tab", async () => {
  const links = [
    landingPage.digitalResourcesLink,
    landingPage.visitLibraryLink,
    landingPage.alternateFormLink,
    landingPage.whatYouCanAccess,
    landingPage.cardholderTerms,
    landingPage.rulesRegulations,
    landingPage.privacyPolicy,
  ];

  for (const link of links) {
    await expect(link).not.toHaveAttribute("target", "_blank");
  }
});
}
