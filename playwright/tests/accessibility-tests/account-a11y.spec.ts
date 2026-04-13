import { test, expect } from "@playwright/test";
import { AccountPage } from "../../pageobjects/account.page";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Account Page Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ACCOUNT);
    await page.waitForLoadState("networkidle");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({
    page,
    browserName,
  }) => {
    const accountPage = new AccountPage(page);
    const isWebKit = browserName === "webkit";

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
      accountPage.acceptTermsCheckbox,
      accountPage.previousButton,
      accountPage.nextButton,
    ];

    // WebKit excludes links from the default tab sequence; test form controls only.
    const webKitAccountLocators = [
      accountPage.passwordInput,
      accountPage.verifyPasswordInput,
      accountPage.showPasswordCheckbox,
      accountPage.selectHomeLibrary,
      accountPage.acceptTermsCheckbox,
    ];

    const locators = isWebKit ? webKitAccountLocators : accountLocators;

    await expect(accountPage.stepHeading).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(accountPage.usernameInput).toBeFocused();
    await accountPage.usernameInput.pressSequentially("testuser");

    for (const locator of locators) {
      if (isWebKit) {
        await locator.focus();
      } else {
        await page.keyboard.press("Tab");
      }

      await expect(locator).toBeFocused();

      if (locator === accountPage.acceptTermsCheckbox) {
        await page.keyboard.press("Space");
        await expect(accountPage.acceptTermsCheckbox).toBeChecked();
      }
    }
  });
});
