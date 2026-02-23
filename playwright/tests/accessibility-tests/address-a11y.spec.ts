import { AddressPage } from "../../pageobjects/address.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";

test.describe("Accessibility tests on Address Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ADDRESS());
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
  test("should reach all form fields via the tab key", async ({ page }) => {
    const addressPage = new AddressPage(page);

    const addressLocators = [
      addressPage.alternateForm,
      addressPage.streetAddressInput,
      addressPage.apartmentSuiteInput,
      addressPage.cityInput,
      addressPage.stateInput,
      addressPage.postalCodeInput,
    ];

    await expect(addressPage.stepHeading).toBeFocused();

    for (const locator of addressLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
