import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/new");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
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

    for (let i = 0; i < languageLocators.length; i++) {
      await expect(languageLocators[i]).toBeFocused();
      if (i < languageLocators.length - 1) {
        await page.keyboard.press("Tab");
      }
    }
  });
});
