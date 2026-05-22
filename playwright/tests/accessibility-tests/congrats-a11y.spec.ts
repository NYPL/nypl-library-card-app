import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { clickNextButton } from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  PATRON_TYPES,
  TEST_BARCODE_NUMBER,
  TEST_EXPIRATION_DATE,
  TEST_PATRON,
} from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import { mockCreatePatronApi } from "../../utils/mock-api";

test.describe("accessibility tests on congrats page", () => {
  let pageManager: PageManager;
  let fullName: string;

  test.beforeEach(async ({ page }) => {
    pageManager = new PageManager(page);
    fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;
    await page.goto(PAGE_ROUTES.REVIEW());
  });

  test.describe("displays congrats page for temporary patron", () => {
    test.beforeEach(async ({ page }) => {
      await mockCreatePatronApi(
        page,
        fullName,
        TEST_BARCODE_NUMBER,
        TEST_EXPIRATION_DATE,
        PATRON_TYPES.DIGITAL_TEMPORARY
      );
      await clickNextButton(
        pageManager.reviewPage,
        pageManager.reviewPage.submitButton,
        pageManager.congratsPage.temporaryHeading
      );
    });

    test("does not have accessibility violations on page", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([...A11Y_GUIDELINES])
        .analyze();
      validateA11yCoverage(accessibilityScanResults);
      expect(accessibilityScanResults.violations).toHaveLength(0);
    });

    test("tabs forward through the page", async () => {
      const congratsLocators = [
        pageManager.congratsPage.locationsLink,
        pageManager.congratsPage.photoIdAndProofOfAddressLink,
        pageManager.congratsPage.learnMoreLink,
        pageManager.congratsPage.getHelpEmailLink,
        pageManager.congratsPage.loginLink,
        pageManager.congratsPage.nyplLocationLink,
        pageManager.congratsPage.findOutLibraryLink,
        pageManager.congratsPage.discoverLink,
      ];
      await expect(pageManager.congratsPage.temporaryHeading).toBeFocused();
      for (const locator of congratsLocators) {
        await pageManager.congratsPage.page.keyboard.press("Tab");
        await expect(locator).toBeFocused();
      }
    });
  });

  test.describe("displays congrats page for metro/non-metro patron", () => {
    test.beforeEach(async ({ page }) => {
      await mockCreatePatronApi(
        page,
        fullName,
        TEST_BARCODE_NUMBER,
        TEST_EXPIRATION_DATE,
        PATRON_TYPES.DIGITAL_METRO
      );
      await clickNextButton(
        pageManager.reviewPage,
        pageManager.reviewPage.submitButton,
        pageManager.congratsPage.metroOrNonMetroHeading
      );
    });

    test("does not have accessibility violations on page", async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags([...A11Y_GUIDELINES])
        .analyze();
      validateA11yCoverage(accessibilityScanResults);
      expect(accessibilityScanResults.violations).toHaveLength(0);
    });

    test("tabs forward through the page", async () => {
      const congratsLocators = [
        pageManager.congratsPage.locationsLink,
        pageManager.congratsPage.photoIdAndProofOfAddressLink,
        pageManager.congratsPage.readListenLink,
        pageManager.congratsPage.loginLink,
        pageManager.congratsPage.nyplLocationLink,
        pageManager.congratsPage.findOutLibraryLink,
        pageManager.congratsPage.discoverLink,
      ];
      await expect(
        pageManager.congratsPage.metroOrNonMetroHeading
      ).toBeFocused();
      for (const locator of congratsLocators) {
        await pageManager.congratsPage.page.keyboard.press("Tab");
        await expect(locator).toBeFocused();
      }
    });
  });
});
