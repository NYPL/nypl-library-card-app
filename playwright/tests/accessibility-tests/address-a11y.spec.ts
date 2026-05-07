import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { AddressPage } from "../../pageobjects/address.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on address page", () => {
  let addressPage: AddressPage;

  test.beforeEach(async ({ page }) => {
    addressPage = new AddressPage(page);
    await page.goto(PAGE_ROUTES.ADDRESS());
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const addressLocators = [
      addressPage.alternateFormLink,
      addressPage.streetAddressInput,
      addressPage.apartmentSuiteInput,
      addressPage.cityInput,
      addressPage.stateInput,
      addressPage.postalCodeInput,
      addressPage.previousButton,
      addressPage.nextButton,
    ];
    await expect(addressPage.stepHeading).toBeFocused();
    for (const locator of addressLocators) {
      await addressPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
