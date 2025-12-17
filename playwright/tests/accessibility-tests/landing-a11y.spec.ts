import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/new");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.arabicLanguage.waitFor();
    await landingPage.mainHeading.waitFor();
    await landingPage.getStartedButton.waitFor();
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .include('[data-testid="ds-list"] a[href="/library-card/new?lang=ar"]')
      .include("#hero-banner")
      .include('[data-testid="ds-heading"]')
      .include("#routing-links-next")
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});
