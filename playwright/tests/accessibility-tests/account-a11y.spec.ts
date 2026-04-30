import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { AccountPage } from "../../pageobjects/account.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import { mockUsernameApi } from "../../utils/mock-api";

test.describe("accessibility tests on account page", () => {
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ACCOUNT());
    accountPage = new AccountPage(page);
  });

  test("does not display accessibility violations", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const accountLocators = [
      accountPage.usernameInput,
      accountPage.passwordInput,
      accountPage.verifyPasswordInput,
      accountPage.showPasswordCheckbox,
      accountPage.nyplLocationLink,
      accountPage.selectHomeLibrary,
      accountPage.cardholderTerms,
      accountPage.rulesRegulations,
      accountPage.privacyPolicy,
      accountPage.acceptTermsCheckbox,
      accountPage.previousButton,
      accountPage.nextButton,
    ];
    await expect(accountPage.stepHeading).toBeFocused();
    for (const locator of accountLocators) {
      await accountPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });

  test("retains focus when checking available username", async ({ page }) => {
    await mockUsernameApi(page, "available");
    await expect(accountPage.availableUsernameButton).toBeDisabled();
    await accountPage.usernameInput.fill("AvailableUsername");
    await expect(accountPage.availableUsernameButton).toBeEnabled();
    await accountPage.page.keyboard.press("Tab");
    await expect(accountPage.availableUsernameButton).toBeFocused();
    await accountPage.availableUsernameButton.press("Enter"); // or "Space"
    await expect(accountPage.availableUsernameButton).toBeDisabled();
    await expect(accountPage.availableUsernameMessage).toBeVisible();
    await expect(accountPage.usernameInput).toBeFocused();
  });

  test("retains focus when checking unavailable username", async ({ page }) => {
    await mockUsernameApi(page, "unavailable");
    await expect(accountPage.availableUsernameButton).toBeDisabled();
    await accountPage.usernameInput.fill("UnavailableUsername");
    await expect(accountPage.availableUsernameButton).toBeEnabled();
    await accountPage.page.keyboard.press("Tab");
    await expect(accountPage.availableUsernameButton).toBeFocused();
    await accountPage.availableUsernameButton.press("Enter"); // or "Space"
    await expect(accountPage.availableUsernameButton).toBeDisabled();
    await expect(accountPage.unavailableUsernameMessage).toBeVisible();
    await expect(accountPage.usernameInput).toBeFocused();
  });

  test("interacts with form fields using keyboard", async () => {
    await accountPage.passwordInput.fill("password123");
    await accountPage.verifyPasswordInput.fill("password123");
    await accountPage.showPasswordCheckbox.focus();
    await accountPage.page.keyboard.press("Space");
    await expect(accountPage.showPasswordCheckbox).toBeChecked();
    await expect(accountPage.passwordInput).toHaveValue("password123");
    await expect(accountPage.verifyPasswordInput).toHaveValue("password123");

    await accountPage.selectHomeLibrary.focus();
    await accountPage.page.keyboard.press("ArrowDown");
    await accountPage.page.keyboard.press("Enter");
    await expect(accountPage.selectHomeLibrary).toHaveValue("vr");

    await accountPage.acceptTermsCheckbox.focus();
    await accountPage.page.keyboard.press("Space");
    await expect(accountPage.acceptTermsCheckbox).toBeChecked();
  });
});
