import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "../../utils/constants";
import { PageManager } from "../../pageobjects/page-manager.page";

test.describe("Visual tests for banner component", () => {
  test("displays banner on landing page", async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING);
    const pageManager = new PageManager(page);
    await expect(pageManager.personalPage.mainHeading).toHaveScreenshot(
      "landing-page-banner-english.png"
    );
  });

  test("displays banner on landing page in Urdu", async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING);
    const pageManager = new PageManager(page);
    await pageManager.landingPage.urduLanguage.click();
    const urduHeading = page.getByRole("heading", {
      name: "للائبریری کارڈ کے لیے آن لائن اپلائی کریں",
      level: 1,
    });
    await expect(urduHeading).toHaveScreenshot("landing-page-banner-urdu.png");
  });
});
