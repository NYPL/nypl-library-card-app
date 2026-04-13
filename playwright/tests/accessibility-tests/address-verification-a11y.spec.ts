import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import { navigateToAddressVerificationPage } from "../../utils/a11y-helper";
import {
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";

test.describe("Accessibility tests on Address Verification page", () => {
  test.beforeEach(async ({ page, context }) => {
    const pageManager = new PageManager(page);

    await context.clearCookies();

    await test.step("Setup: Navigate to Address Verification", async () => {
      await navigateToAddressVerificationPage({
        page,
        pageManager,
        patronData: TEST_PATRON,
        addressData: TEST_OOS_ADDRESS,
        alternateAddressData: TEST_NYC_ADDRESS,
      });
    });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    await expect(page).not.toHaveURL(/.*\/location\?.*newCard=true/);
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page, browserName }) => {
    // 1. Skip Webkit early if it's unsupported
    test.skip(
      browserName === "webkit",
      "Webkit handles radio groups differently in Playwright"
    );

    const addressVerification = new AddressVerificationPage(page);

    // 2. Ensure we are actually on the right page before starting
    await expect(page).not.toHaveURL(/.*\/location\?.*newCard=true/);
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/, {
      timeout: 10000,
    });

    // 3. Accessibility best practice: ensure the heading is the starting point
    await expect(addressVerification.stepHeading).toBeVisible();
    await addressVerification.stepHeading.focus();

    // 4. Simplify the locator list
    // Tab order on this page reaches both checked radios before the action buttons.
    const navigationLocators = [
      addressVerification.getRadioButtons.nth(1),
      addressVerification.previousButton,
      addressVerification.nextButton,
    ];

    // Tab into the radio group
    await page.keyboard.press("Tab");
    // Expect the first/checked radio to have focus
    await expect(addressVerification.getRadioButtons.first()).toBeFocused();

    // Tab through buttons
    for (const locator of navigationLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
