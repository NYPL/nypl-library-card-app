import { test, expect } from "@playwright/test";
import { AccountPage } from "../../pageobjects/account.page";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import {
  A11Y_GUIDELINES,
  validateA11yCoverage,
  USED_USER_NAME,
  AVAILABLE_USER_NAME,
} from "../../utils/a11y-utils";
import { mockUsernameApi, usernameResponse } from "../../utils/mock-api";

test.describe("Account Page Accessibility Tests", () => {
  test.beforeEach(async ({ page, browserName }) => {
    await page.goto(PAGE_ROUTES.ACCOUNT());
    console.log({ browserName, platform: process.platform });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({ page }) => {
    const accountPage = new AccountPage(page);

    const accountLocators = [
      accountPage.availableUsernameButton,
      accountPage.passwordInput,
      accountPage.verifyPasswordInput,
      accountPage.showPasswordCheckbox,
      accountPage.nyplLocationLink,
      accountPage.selectHomeLibrary,
      accountPage.cardholderTerms,
      accountPage.rulesRegulations,
      accountPage.privacyPolicy,
    ];

    await expect(accountPage.stepHeading).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(accountPage.usernameInput).toBeFocused();
    await accountPage.usernameInput.fill("testuser");
    await expect(accountPage.availableUsernameButton).toBeEnabled();

    for (const locator of accountLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }

    await page.keyboard.press("Tab");
    await expect(accountPage.acceptTermsCheckbox).toBeFocused();
    await page.keyboard.press("Space");
    await expect(accountPage.acceptTermsCheckbox).toBeChecked();
  });

  test("should retain focus when checking unavailable username", async ({
    page,
  }) => {
    await mockUsernameApi(page, "unavailable");
    const accountPage = new AccountPage(page);
    await expect(accountPage.stepHeading).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(accountPage.usernameInput).toBeFocused();
    await accountPage.usernameInput.pressSequentially(USED_USER_NAME);
    await expect(accountPage.availableUsernameButton).toBeEnabled();
    await page.keyboard.press("Tab");
    await expect(accountPage.availableUsernameButton).toBeFocused();
    await accountPage.availableUsernameButton.press("Enter");
    await expect(
      page.getByText(usernameResponse.unavailable.message)
    ).toBeVisible();
    await expect(accountPage.availableUsernameButton).toBeDisabled();
  });

  test("should retain focus when checking available username", async ({
    page,
  }) => {
    await mockUsernameApi(page, "available");
    const accountPage = new AccountPage(page);
    await expect(accountPage.stepHeading).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(accountPage.usernameInput).toBeFocused();
    await accountPage.usernameInput.pressSequentially(AVAILABLE_USER_NAME);
    await expect(accountPage.availableUsernameButton).toBeEnabled();
    await page.keyboard.press("Tab");
    await expect(accountPage.availableUsernameButton).toBeFocused();
    await accountPage.availableUsernameButton.press("Enter");
    await expect(accountPage.availableUsernameButton).toBeDisabled();
  });
});
