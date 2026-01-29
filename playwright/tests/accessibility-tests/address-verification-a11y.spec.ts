import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import { fillAddress } from "../../utils/form-helper";
import { TEST_NYC_ADDRESS } from "../../utils/constants";

test.describe("Accessibility tests on Address Verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/location?newCard=true");
    const pm = new PageManager(page);
    await fillAddress(pm.addressPage, TEST_NYC_ADDRESS);
    await expect(pm.addressPage.nextButton).toBeVisible();
    await pm.addressPage.nextButton.click();
    await expect(pm.addressVerificationPage.homeAddressHeading).toBeVisible();
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page }) => {
    const addressVerification = new AddressVerificationPage(page);
    await page.keyboard.press("Tab");
    await expect(addressVerification.radioButton).toBeFocused();
  });
});
