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

    const addressLocators = [
      addressPage.streetAddressInput,
      addressPage.apartmentSuiteInput,
      addressPage.cityInput,
      addressPage.stateInput,
      addressPage.postalCodeInput,
      addressPage.previousButton,
      addressPage.nextButton,
    ];

    await addressLocators[0].focus();

    for (
      let locatorIndex = 0;
      locatorIndex < addressLocators.length;
      locatorIndex++
    ) {
      await addressLocators[locatorIndex].focus();
      await expect(addressLocators[locatorIndex]).toBeFocused();
      if (locatorIndex < addressLocators.length - 1) {
        await page.keyboard.press("Tab");
      }
    }
  });
});
