import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING);
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
    test.skip(
      browserName === "webkit",
      "WebKit on macOS does not include links in the default Tab sequence"
    );

    const landingPage = new LandingPage(page);

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

    await page.keyboard.press("Control+Home");
    await expect(landingPage.mainHeading).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(landingPage.skipToMainContentLink).toBeFocused();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(landingPage.arabicLanguage).toBeFocused();

    for (const locator of landingLocators.slice(1)) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
