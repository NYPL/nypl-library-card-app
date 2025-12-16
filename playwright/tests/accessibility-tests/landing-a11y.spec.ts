import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/new");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const landingPage = new LandingPage(page);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    await expect(landingPage.mainHeading).toBeVisible();
    await expect(landingPage.getStartedButton).toBeVisible();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
});
