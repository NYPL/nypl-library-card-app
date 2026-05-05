import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { AlternateAddressPage } from "../../pageobjects/alternate-address.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on alternate address page", () => {
  let alternateAddress: AlternateAddressPage;

  test.beforeEach(async ({ page }) => {
    alternateAddress = new AlternateAddressPage(page);
    await page.goto(PAGE_ROUTES.ALTERNATE_ADDRESS());
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const alternateAddressLocators = [
      alternateAddress.streetAddressInput,
      alternateAddress.apartmentSuiteInput,
      alternateAddress.cityInput,
      alternateAddress.stateInput,
      alternateAddress.postalCodeInput,
      alternateAddress.previousButton,
      alternateAddress.nextButton,
    ];
    await expect(alternateAddress.stepHeading).toBeFocused();
    for (const locator of alternateAddressLocators) {
      await alternateAddress.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
