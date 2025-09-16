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

test("displays error when username is unavailable", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("username");
  await accountPage.availableUsernameButton.click();
  await expect(accountPage.availableUsernameButton).toBeDisabled();
  await expect(accountPage.unavailableUsernameError).toBeVisible();
});
test("displays message when username is available", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("validusername");
  await accountPage.availableUsernameButton.click();
  await expect(accountPage.availableUsernameButton).toBeDisabled();
  await expect(accountPage.availableUsername).toBeVisible();
});

test("displays error when passwords do not match", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("ValidUser1");
  await accountPage.passwordInput.fill("ValidPass1!");
  await accountPage.verifyPasswordInput.fill("DifferentPass1!");
  await accountPage.nextButton.click();
  await expect(accountPage.verifyPasswordError).toBeVisible();
});

test("displays error when terms are not accepted", async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.usernameInput.fill("ValidUser1");
  await accountPage.passwordInput.fill("ValidPass1!");
  await accountPage.verifyPasswordInput.fill("ValidPass1!");
  await accountPage.nextButton.click();
  await expect(accountPage.acceptTermsError).toBeVisible();
});

test.describe("displays errors for invalid fields", () => {
  test("enter too many characters", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    await accountPage.passwordInput.fill("123456789012345678901234567890123");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
    await expect(accountPage.passwordError).toBeVisible();
  });

  test("enter too few characters", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("A");
    await accountPage.passwordInput.fill("1!");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
    await expect(accountPage.passwordError).toBeVisible();
  });

  test("enter special characters in username", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("User!@#");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
  });

  test("enter non-Latin characters", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("用戶名用戶名");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
  });
});
