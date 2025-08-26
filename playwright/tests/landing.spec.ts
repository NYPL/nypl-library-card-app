import { test, expect } from "@playwright/test";
import { LandingPage } from "../pageobjects/landing.page";

test.beforeEach(async ({ page }) => {
  await page.goto("");
});

test("displays the main heading", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.mainHeading).toBeVisible();
});

test("displays the apply heading", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.applyHeading).toBeVisible();
});

test("displays get started button", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.getStartedButton).toBeVisible();
});
