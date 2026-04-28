import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING());
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should have keyboard focus indicators for language links", async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);

    const languageLocators = [
      landingPage.arabicLanguage,
      landingPage.bengaliLanguage,
      landingPage.chineseLanguage,
      landingPage.englishLanguage,
      landingPage.frenchLanguage,
      landingPage.haitianCreoleLanguage,
      landingPage.koreanLanguage,
      landingPage.polishLanguage,
      landingPage.russianLanguage,
      landingPage.spanishLanguage,
      landingPage.urduLanguage,
    ];

    await languageLocators[0].focus();
    await expect(languageLocators[0]).toBeFocused();
    for (let i = 1; i < languageLocators.length; i++) {
      await page.keyboard.press("Tab");
      await expect(languageLocators[i]).toBeFocused();
    }
  });
});
