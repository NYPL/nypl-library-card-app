import AxeBuilder from "@axe-core/playwright";
import { AlternateAddressPage } from "../../pageobjects/alternate-address.page";
import { test, expect } from "@playwright/test";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("Accessibility tests on Alternate Address page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.ALTERNATE_ADDRESS);
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
    const alternateAddress = new AlternateAddressPage(page);

    const inputLocators = [
      alternateAddress.streetAddressInput,
      alternateAddress.apartmentSuiteInput,
      alternateAddress.cityInput,
      alternateAddress.stateInput,
      alternateAddress.postalCodeInput,
    ];
    const linkButtons = [
      alternateAddress.previousButton,
      alternateAddress.nextButton,
    ];

    // WebKit on macOS does not include links in the default Tab sequence
    const locators =
      browserName === "webkit"
        ? [...inputLocators]
        : [...inputLocators, ...linkButtons];

    await expect(alternateAddress.stepHeading).toBeFocused();

    for (const locator of locators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
