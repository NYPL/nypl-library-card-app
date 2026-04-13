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
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page, browserName }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const addressVerification = new AddressVerificationPage(page);

    const radioButtons = await addressVerification.getRadioButtons.all();

    test.skip(browserName === "webkit");

    const addressVerificationLocators = [
      ...radioButtons,
      addressVerification.previousButton,
      addressVerification.nextButton,
    ];

    await expect(addressVerification.stepHeading).toBeFocused();

    for (const locator of addressVerificationLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
