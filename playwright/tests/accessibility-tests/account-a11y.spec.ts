import { test, expect } from "@playwright/test";
import { AccountPage } from "../../pageobjects/account.page";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Account Page Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/account?newCard=true");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({ page }) => {
    const accountPage = new AccountPage(page);

    const accountLocators = [
      accountPage.availableUsernameButton,
      accountPage.passwordInput,
      accountPage.verifyPasswordInput,
      accountPage.showPasswordCheckbox,
      accountPage.selectHomeLibrary,
      accountPage.cardholderTerms,
      accountPage.rulesRegulations,
      accountPage.privacyPolicy,
    ];

    await expect(accountPage.stepHeading).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(accountPage.usernameInput).toBeFocused();
    await accountPage.usernameInput.fill("testuser");

    for (const locator of accountLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }

    await page.keyboard.press("Tab");
    await expect(accountPage.acceptTermsCheckbox).toBeFocused();
    await page.keyboard.press("Space");
    await expect(accountPage.acceptTermsCheckbox).toBeChecked();
  });
});
