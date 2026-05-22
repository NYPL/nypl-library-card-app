import { AddressPage } from "../../pageobjects/address.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Address Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ADDRESS());
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
  test("should reach all form fields via the tab key", async ({ page }) => {
    const addressPage = new AddressPage(page);

    const addressLocators = [
      addressPage.alternateFormLink,
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
