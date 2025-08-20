import { test, expect } from "@playwright/test";
import { LandingPage } from "../pages/landing.page";

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

test("displays available languages", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.arabicLanguage).toBeVisible();
  await expect(landingPage.bengaliLanguage).toBeVisible();
  await expect(landingPage.chineseLanguage).toBeVisible();
  await expect(landingPage.englishLanguage).toBeVisible();
  await expect(landingPage.frenchLanguage).toBeVisible();
  await expect(landingPage.haitianCreoleLanguage).toBeVisible();
  await expect(landingPage.koreanLanguage).toBeVisible();
  await expect(landingPage.polishLanguage).toBeVisible();
  await expect(landingPage.russianLanguage).toBeVisible();
  await expect(landingPage.spanishLanguage).toBeVisible();
  await expect(landingPage.urduLanguage).toBeVisible();
});

test("displays informational links", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.learnMore).toBeVisible();
  await expect(landingPage.cardholderTerms).toBeVisible();
  await expect(landingPage.rulesRegulations).toBeVisible();
  await expect(landingPage.privacyPolicy).toBeVisible();
});
