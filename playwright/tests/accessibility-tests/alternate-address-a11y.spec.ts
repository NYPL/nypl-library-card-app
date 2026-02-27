import AxeBuilder from "@axe-core/playwright";
import { AlternateAddressPage } from "../../pageobjects/alternate-address.page";
import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "../../utils/constants";

test.describe("Accessibility tests on Alternate Address page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ALTERNATE_ADDRESS());
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({ page }) => {
    const alternateAddress = new AlternateAddressPage(page);

    const alternateAddressLocators = [
      alternateAddress.streetAddressInput,
      alternateAddress.apartmentSuiteInput,
      alternateAddress.cityInput,
      alternateAddress.stateInput,
      alternateAddress.postalCodeInput,
    ];
    await expect(alternateAddress.stepHeading).toBeFocused();

    for (const locator of alternateAddressLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
