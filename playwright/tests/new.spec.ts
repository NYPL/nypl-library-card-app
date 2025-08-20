import { test, expect } from "@playwright/test";
import { NewPage } from "../pages/new.page";

test.beforeEach(async ({ page }) => {
  await page.goto("");
});

test("displays the main heading", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.mainHeading).toBeVisible();
});

test("displays the apply heading", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.applyHeading).toBeVisible();
});

test("displays get started button", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.getStartedButton).toBeVisible();
});

test("displays available languages", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.arabicLanguage).toBeVisible();
  await expect(newPage.bengaliLanguage).toBeVisible();
  await expect(newPage.chineseLanguage).toBeVisible();
  await expect(newPage.englishLanguage).toBeVisible();
  await expect(newPage.frenchLanguage).toBeVisible();
  await expect(newPage.haitianCreoleLanguage).toBeVisible();
  await expect(newPage.koreanLanguage).toBeVisible();
  await expect(newPage.polishLanguage).toBeVisible();
  await expect(newPage.russianLanguage).toBeVisible();
  await expect(newPage.spanishLanguage).toBeVisible();
  await expect(newPage.urduLanguage).toBeVisible();
});

test("displays informational links", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.learnMore).toBeVisible();
  await expect(newPage.cardholderTerms).toBeVisible();
  await expect(newPage.rulesRegulations).toBeVisible();
  await expect(newPage.privacyPolicy).toBeVisible();
});
