import { test, expect } from "@playwright/test";
import { AccountPage } from "../pageobjects/account.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/account?newCard=true");
});

test.describe("displays all form elements on Account page", () => {
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
});

test.describe("displays errors for invalid inputs on Account page", () => {
  test("displays errors for required fields", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("");
    await accountPage.passwordInput.fill("");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
    await expect(accountPage.passwordError).toBeVisible();
  });

  test("displays error when special characters in username", async ({
    page,
  }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("User!@#");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
  });

  test("displays error when non-Latin characters in username", async ({
    page,
  }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("用戶名用戶名");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
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

  test("displays error with too many characters", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    await accountPage.passwordInput.fill("123456789012345678901234567890123");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
    await expect(accountPage.passwordError).toBeVisible();
  });

  test("displays error with too few characters", async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("A");
    await accountPage.passwordInput.fill("1!");
    await accountPage.nextButton.click();
    await expect(accountPage.usernameError).toBeVisible();
    await expect(accountPage.passwordError).toBeVisible();
  });
});

test.describe("mock API responses on Account page", () => {
  test("displays username available message", async ({ page }) => {
    // mock the API call for username availability
    await page.route("**/library-card/api/username", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "This username is available." }),
      });
    });

    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("AvailableUsername");
    await accountPage.availableUsernameButton.click();
    await expect(accountPage.availableUsernameMessage).toBeVisible();
  });

  test("displays username unavailable error message", async ({ page }) => {
    // mock the API call for username unavailability
    await page.route("**/library-card/api/username", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          message: "This username is unavailable. Please try another.",
        }),
      });
    });

    const accountPage = new AccountPage(page);
    await accountPage.usernameInput.fill("UnavailableUsername");
    await accountPage.availableUsernameButton.click();
    await expect(accountPage.unavailableUsernameError).toBeVisible();
  });
});
