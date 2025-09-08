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

test("displays account form", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.usernameInput).toBeVisible();
  await expect(accountPage.availableUsernameButton).toBeVisible();
  await expect(accountPage.passwordInput).toBeVisible();
  await expect(accountPage.verifyPasswordInput).toBeVisible();
  await expect(accountPage.showPasswordCheckbox).toBeVisible();
});

test("displays next and previous buttons", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await expect(accountPage.nextButton).toBeVisible();
  await expect(accountPage.previousButton).toBeVisible();
});
