import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "../../utils/constants";
import { LandingPage } from "../../pageobjects/landing.page";

test.describe("Visual tests for banner component", () => {
  test("displays banner on landing page", async ({ page }) => {
    await page.goto(PAGE_ROUTES.LANDING, { waitUntil: "networkidle" });
    const landingPage = new LandingPage(page);
    await expect(landingPage.mainHeading).toBeVisible();
    await expect(landingPage.heroBanner).toHaveScreenshot(
      "landing-page-banner-english.png",
      {
        mask: [page.locator(".hero-background-image")], // Use the actual selector for the image
        maxDiffPixelRatio: 0.02, // Now you can be very strict!
      }
    );
  });

  test("displays banner on landing page in Urdu", async ({ page }) => {
    const urduUrl = `${PAGE_ROUTES.LANDING}&lang=ur`;
    await page.goto(urduUrl, { waitUntil: "networkidle" });
    const landingPage = new LandingPage(page);

    await expect(landingPage.heroBanner).toBeVisible();
    await expect(landingPage.mainHeading).toHaveText(
      /للائبریری کارڈ کے لیے آن لائن اپلائی کریں/
    );
    await expect(landingPage.heroBanner).toHaveScreenshot(
      "landing-page-banner-urdu.png",
      {
        maxDiffPixelRatio: 0.05,
      }
    );
  });
});
