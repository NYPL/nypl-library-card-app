import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING);
    // Crucial: Fixes the "element not found" error by waiting for hydration
    await page.waitForLoadState("networkidle");
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
    browserName,
  }) => {
    const landingPage = new LandingPage(page);
    const isWebKit = browserName === "webkit";

    const landingLocators = [
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
      landingPage.digitalResourcesLink,
      landingPage.visitLibraryLink,
      landingPage.alternateFormLink,
      landingPage.whatYouCanAccess,
      landingPage.cardholderTerms,
      landingPage.rulesRegulations,
      landingPage.privacyPolicy,
      landingPage.getStartedButton,
    ];

    // Reset focus to top
    await page.keyboard.press("Control+Home");
    await expect(landingPage.mainHeading).toBeVisible();

    // Test Skip Link
    if (isWebKit) {
      await landingPage.skipToMainContentLink.focus();
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(landingPage.skipToMainContentLink).toBeFocused();

    // Activate skip link and move to content
    await page.keyboard.press("Enter");

    // First Language Link (Arabic)
    if (isWebKit) {
      await landingPage.arabicLanguage.focus();
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(landingPage.arabicLanguage).toBeFocused();

    // Loop through remaining locators
    for (const locator of landingLocators.slice(1)) {
      if (isWebKit) {
        // Forces focus to bypass WebKit's link-skipping and 'inactive' lag
        await locator.focus();
      } else {
        await page.keyboard.press("Tab");
      }

      await expect(locator).toBeFocused();
    }
  });
});
