import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { clickNextButton, fillAddress } from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
} from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on address verification page", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    await page.goto(PAGE_ROUTES.ADDRESS());

    await expect(pageManager.addressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
    await clickNextButton(
      pageManager.addressPage,
      pageManager.addressPage.nextButton,
      pageManager.alternateAddressPage.stepHeading
    );

    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
    await clickNextButton(
      pageManager.alternateAddressPage,
      pageManager.alternateAddressPage.nextButton,
      pageManager.addressVerificationPage.stepHeading
    );

    await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async ({ page }) => {
    const radioButtons =
      await pageManager.addressVerificationPage.getRadioButtons.all();

    const addressVerificationLocators = [
      ...radioButtons,
      pageManager.addressVerificationPage.previousButton,
      pageManager.addressVerificationPage.nextButton,
    ];

    await expect(pageManager.addressVerificationPage.stepHeading).toBeFocused();

    for (const locator of addressVerificationLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
