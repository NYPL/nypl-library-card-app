import { test, expect } from "@playwright/test";
import { LandingPage } from "../pageobjects/landing.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/new");
});

test("displays the main heading", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.mainHeading).toBeVisible();
});

test("displays the apply heading", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.applyHeading).toBeVisible();
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

test("displays informational links, informational banner and get started button", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);

  await expect(landingPage.digitalResourcesLink).toBeVisible();
  await expect(landingPage.visitLibraryLink).toBeVisible();
  await expect(landingPage.alternateFormLink).toBeVisible();
  await expect(landingPage.whatYouCanAccess).toBeVisible();
  await expect(landingPage.cardholderTerms).toBeVisible();
  await expect(landingPage.rulesRegulations).toBeVisible();
  await expect(landingPage.privacyPolicy).toBeVisible();
  await expect(landingPage.informationalBanner).toBeVisible();
  await expect(landingPage.getStartedButton).toBeVisible();
});

test("opens links in same tab", async ({ page }) => {
  const landingPage = new LandingPage(page);
  const links = [
    landingPage.digitalResourcesLink,
    landingPage.visitLibraryLink,
    landingPage.alternateFormLink,
    landingPage.whatYouCanAccess,
    landingPage.cardholderTerms,
    landingPage.rulesRegulations,
    landingPage.privacyPolicy,
  ];

  for (const link of links) {
    await expect(link).not.toHaveAttribute("target", "_blank");
  }
});
