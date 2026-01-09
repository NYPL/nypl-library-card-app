import { AddressPage } from "../../pageobjects/address.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on Address Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/location?newCard=true");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });
  test("should have keyboard focus indicators for form fields and buttons", async ({
    page,
  }) => {
    const addressPage = new AddressPage(page);

    await addressPage.streetAddressInput.focus();
    await addressPage.streetAddressInput.fill("123 Main St");
    await expect(addressPage.streetAddressInput).toBeFocused();

    await page.keyboard.press("Tab");
    await addressPage.apartmentSuiteInput.fill("Apt 4B");
    await expect(addressPage.apartmentSuiteInput).toBeFocused();

    await page.keyboard.press("Tab");
    await addressPage.cityInput.fill("New York");
    await expect(addressPage.cityInput).toBeFocused();

    await page.keyboard.press("Tab");
    await addressPage.stateInput.fill("NY");
    await expect(addressPage.stateInput).toBeFocused();

    await page.keyboard.press("Tab");
    await addressPage.postalCodeInput.fill("10001");
    await expect(addressPage.postalCodeInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(addressPage.previousButton).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(addressPage.nextButton).toBeFocused();
  });
});
