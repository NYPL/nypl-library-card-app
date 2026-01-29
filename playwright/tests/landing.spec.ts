import { test, expect } from "@playwright/test";
import { LandingPage } from "../pageobjects/landing.page";
import { SUPPORTED_LANGUAGES } from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`landing page in ${name} (${lang})`, () => {
    let landingPage: LandingPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      landingPage = new LandingPage(page, appContent);
      await page.goto(`/library-card/new?newCard=true&lang=${lang}`);
    });

    test("displays the main heading", async () => {
      await expect(landingPage.mainHeading).toBeVisible();
    });

    test("displays the apply heading", async () => {
      await expect(landingPage.applyHeading).toBeVisible();
    });

    test("displays get started button", async () => {
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

    test("displays informational links", async () => {
      await expect(landingPage.whatYouCanAccess).toBeVisible();
      //   await expect(landingPage.cardholderTerms).toBeVisible();
      //   await expect(landingPage.rulesRegulations).toBeVisible();
      //   await expect(landingPage.privacyPolicy).toBeVisible();
    });
  });
}
