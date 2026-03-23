import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "../../utils/constants";
import { LandingPage } from "../../pageobjects/landing.page";

test.describe("Visual tests for banner component", () => {
  test("displays banner on landing page", async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING, { waitUntil: "commit" });
    const landingPage = new LandingPage(page);
    await expect(landingPage.mainHeading).toBeVisible();
    await expect(landingPage.mainHeading).toHaveScreenshot(
      "landing-page-banner-english.png"
    );
  });

  test("displays banner on landing page in Urdu", async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING, { waitUntil: "commit" });
    const landingPage = new LandingPage(page);
    await landingPage.urduLanguage.click();

    await expect(landingPage.heroBanner).toBeVisible();
    await expect(landingPage.mainHeading).toBeVisible();
    await expect(landingPage.heroBanner).toHaveScreenshot(
      "landing-page-banner-urdu.png"
    );
  });
});
