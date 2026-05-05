import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { LandingPage } from "../../pageobjects/landing.page";
import { GlobalComponentsPage } from "../../pageobjects/global-components.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on landing page", () => {
  let landingPage: LandingPage;
  let globalComponents: GlobalComponentsPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    globalComponents = new GlobalComponentsPage(page);
    await page.goto(PAGE_ROUTES.LANDING());
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const landingLocators = [
      globalComponents.homeBreadcrumb,
      globalComponents.getLibraryCardBreadcrumb,
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
    for (const locator of landingLocators) {
      await landingPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
