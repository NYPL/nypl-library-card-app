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

test("displays languages", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.arabicLanguage).toBeVisible();
  // add more language checks
});

test("displays links", async ({ page }) => {
  const newPage = new NewPage(page);
  await expect(newPage.learnMore).toBeVisible();
  await expect(newPage.cardholderTerms).toBeVisible();
  await expect(newPage.rulesRegulations).toBeVisible();
  await expect(newPage.privacyPolicy).toBeVisible(); // QA doesn't have header/footer so this will fail in prod
});
