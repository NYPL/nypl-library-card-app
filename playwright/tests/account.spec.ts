import { test, expect } from "@playwright/test";
import { AccountPage } from "../pageobjects/account.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/account?newCard=true");
});

test("displays all headings", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.mainHeading).toBeVisible();
  await expect(accountPage.stepHeading).toBeVisible();
  await expect(accountPage.homeLibraryHeading).toBeVisible();
});

test("displays username and password form", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.usernameInput).toBeVisible();
  await expect(accountPage.availableUsernameButton).toBeVisible();
  await expect(accountPage.passwordInput).toBeVisible();
  await expect(accountPage.verifyPasswordInput).toBeVisible();
  await expect(accountPage.showPasswordCheckbox).toBeVisible();
});

test("displays home library form", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.selectHomeLibrary).toBeVisible();
  await expect(accountPage.cardholderTerms).toBeVisible();
  await expect(accountPage.rulesRegulations).toBeVisible();
  await expect(accountPage.privacyPolicy).toBeVisible();
  await expect(accountPage.acceptTermsCheckbox).toBeVisible();
});

test("displays next and previous buttons", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.nextButton).toBeVisible();
  await expect(accountPage.previousButton).toBeVisible();
});

test("displays errors for required fields", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("");
  await accountPage.passwordInput.fill("");
  await accountPage.nextButton.click();
  await expect(accountPage.usernameError).toBeVisible();
  await expect(accountPage.passwordError).toBeVisible();
});

test("displays error when passwords do not match", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("ValidUser1");
  await accountPage.passwordInput.fill("ValidPass1!");
  await accountPage.verifyPasswordInput.fill("DifferentPass1!");
  await accountPage.nextButton.click();
  await expect(accountPage.verifyPasswordError).toBeVisible();
});
