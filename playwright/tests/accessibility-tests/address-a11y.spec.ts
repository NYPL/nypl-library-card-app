import { AddressPage } from "../../pageobjects/address.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Address Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ADDRESS);
    await page.waitForLoadState("networkidle");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({
    page,
    browserName,
  }) => {
    const addressPage = new AddressPage(page);
    const isWebKit = browserName === "webkit";

    const addressFormFieldsLocators = [
      addressPage.streetAddressInput,
      addressPage.apartmentSuiteInput,
      addressPage.cityInput,
      addressPage.stateInput,
      addressPage.postalCodeInput,
    ];
    const linkButtons = [addressPage.previousButton, addressPage.nextButton];

    // WebKit on macOS does not include links in the default Tab sequence
    const locators = isWebKit
      ? [...addressFormFieldsLocators]
      : [
          addressPage.alternateForm,
          ...addressFormFieldsLocators,
          ...linkButtons,
        ];

    await addressPage.stepHeading.focus();
    await expect(addressPage.stepHeading).toBeFocused();

    for (const locator of locators) {
      if (isWebKit) {
        await locator.focus();
      } else {
        await page.keyboard.press("Tab");
      }
      await expect(locator).toBeFocused();
    }
  });
});
