import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import { fillAddress, fillPersonalInfo } from "../../utils/form-helper";
import { TEST_NYC_ADDRESS, TEST_OOS_ADDRESS } from "../../utils/constants";

test.describe("Accessibility tests on Address Verification page", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/library-card/personal?newCard=true");
    const pageManager = new PageManager(page);

    await fillPersonalInfo(pageManager.personalPage);
    await pageManager.personalPage.nextButton.click();

    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
    await pageManager.addressPage.nextButton.click();

    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
    await pageManager.alternateAddressPage.nextButton.click();

    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();

    await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?&?newCard=true/);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const addressVerification = new AddressVerificationPage(page);

    const addressVerificationLocators = [
      addressVerification.radioHomeButton,
      addressVerification.radioAlternateButton,
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
