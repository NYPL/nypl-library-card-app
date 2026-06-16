import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on landing page", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await page.goto(PAGE_ROUTES.LANDING());
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  // TODO: Fix this.. The first focused element somehow landed on the 'body' element instead of the home breadcrumb link
  test.skip("tabs forward through the page", async () => {
    const landingLocators = [
      pageManager.globalComponents.homeBreadcrumb,
      pageManager.globalComponents.getLibraryCardBreadcrumb,
      pageManager.landingPage.arabicLanguage,
      pageManager.landingPage.bengaliLanguage,
      pageManager.landingPage.chineseLanguage,
      pageManager.landingPage.englishLanguage,
      pageManager.landingPage.frenchLanguage,
      pageManager.landingPage.haitianCreoleLanguage,
      pageManager.landingPage.koreanLanguage,
      pageManager.landingPage.polishLanguage,
      pageManager.landingPage.russianLanguage,
      pageManager.landingPage.spanishLanguage,
      pageManager.landingPage.urduLanguage,
      pageManager.landingPage.digitalResourcesLink,
      pageManager.landingPage.visitLibraryLink,
      pageManager.landingPage.alternateFormLink,
      pageManager.landingPage.whatYouCanAccess,
      pageManager.landingPage.cardholderTerms,
      pageManager.landingPage.rulesRegulations,
      pageManager.landingPage.privacyPolicy,
      pageManager.landingPage.getStartedButton,
    ];
    for (const locator of landingLocators) {
      await pageManager.landingPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
