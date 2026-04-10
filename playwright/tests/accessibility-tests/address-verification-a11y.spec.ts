import { AxeBuilder } from "@axe-core/playwright";
import { AddressVerificationPage } from "../../pageobjects/address-verification.page";
import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  clickNextButton,
  fillAddress,
  fillPersonalInfo,
} from "../../utils/form-helper";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import {
  PAGE_ROUTES,
  SPINNER_TIMEOUT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";

test.describe("Accessibility tests on Address Verification page", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(PAGE_ROUTES.PERSONAL);
    const pageManager = new PageManager(page);

    await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
    await clickNextButton(
      pageManager.personalPage,
      pageManager.personalPage.nextButton,
      pageManager.addressPage.stepHeading,
      SPINNER_TIMEOUT
    );

    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
    await clickNextButton(
      pageManager.addressPage,
      pageManager.addressPage.nextButton,
      pageManager.alternateAddressPage.stepHeading,
      SPINNER_TIMEOUT
    );

    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
    await clickNextButton(
      pageManager.alternateAddressPage,
      pageManager.alternateAddressPage.nextButton,
      pageManager.addressVerificationPage.stepHeading,
      SPINNER_TIMEOUT
    );

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

  test("keyboard navigation", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/address-verification\?.*newCard=true/);
    const addressVerification = new AddressVerificationPage(page);

    const radioButtons = await addressVerification.getRadioButtons.all();

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
