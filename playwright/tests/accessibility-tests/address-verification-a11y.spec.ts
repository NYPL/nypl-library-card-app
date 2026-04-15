import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  A11Y_GUIDELINES,
  validateA11yCoverage,
  pressTab,
} from "../../utils/a11y-utils";
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
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page, browserName }) => {
    const addressVerification = new AddressVerificationPage(page);

    await expect(addressVerification.stepHeading).toBeVisible();
    await expect(addressVerification.stepHeading).toBeFocused();
    const radioButtons = addressVerification.getRadioButtons;

    await pressTab(page, browserName);
    await expect(radioButtons.nth(0)).toBeFocused();

    await pressTab(page, browserName);
    await expect(radioButtons.nth(1)).toBeFocused();

    const buttons = [
      addressVerification.previousButton,
      addressVerification.nextButton,
    ];

    for (const locator of buttons) {
      await pressTab(page, browserName);
      await expect(locator).toBeFocused();
    }
  });
});
