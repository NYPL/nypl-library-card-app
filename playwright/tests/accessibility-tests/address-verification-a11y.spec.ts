import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import { fillAddress, fillPersonalInfo } from "../../utils/form-helper";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import {
  PAGE_ROUTES,
  SPINNER_TIMEOUT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";

const ADDRESS_ROUTE_PATTERN = /\/location\?.*newCard=true/;
const ALTERNATE_ADDRESS_ROUTE_PATTERN = /\/alternate-address\?.*newCard=true/;
const ADDRESS_VERIFICATION_ROUTE_PATTERN =
  /\/address-verification\?.*newCard=true/;

test.describe("Accessibility tests on Address Verification page", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(PAGE_ROUTES.PERSONAL);
    const pageManager = new PageManager(page);

    await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);

    // Guard against occasional empty first-name value before progressing.
    if ((await pageManager.personalPage.firstNameInput.inputValue()) === "") {
      await pageManager.personalPage.firstNameInput.fill(TEST_PATRON.firstName);
    }

    await expect(pageManager.personalPage.nextButton).toBeEnabled();

    await pageManager.personalPage.nextButton.click();
    await expect(page).toHaveURL(ADDRESS_ROUTE_PATTERN);

    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
    await expect(pageManager.addressPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
    await expect(pageManager.addressPage.nextButton).toBeEnabled();
    await pageManager.addressPage.nextButton.click();
    await expect(page).toHaveURL(ALTERNATE_ADDRESS_ROUTE_PATTERN);

    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
    await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
    await expect(pageManager.alternateAddressPage.nextButton).toBeEnabled();
    await pageManager.alternateAddressPage.nextButton.click();
    await expect(page).toHaveURL(ADDRESS_VERIFICATION_ROUTE_PATTERN);

    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();

    await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("keyboard navigation", async ({ page, browserName }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const addressVerification = new AddressVerificationPage(page);

    const radioButtons = await addressVerification.getRadioButtons.all();

    test.skip(browserName === "webkit");

    const addressVerificationLocators = [
      ...radioButtons,
      addressVerification.previousButton,
      addressVerification.nextButton,
    ];

    await expect(addressVerification.stepHeading).toBeFocused();

    for (const locator of addressVerificationLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
